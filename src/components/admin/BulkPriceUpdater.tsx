import { useState, useRef, useEffect } from 'react';
import { Upload, Check, AlertCircle, RefreshCw, AlertTriangle, ChevronDown, ChevronUp, Download, Trash2, Clock } from 'lucide-react';
import * as XLSX from 'xlsx';
import * as pdfjs from 'pdfjs-dist';
import { useProducts } from '../../context/ProductsContext';

// Set up PDF.js worker dynamically based on the installed version
// @ts-ignore
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

interface PriceUpdate {
  code: string;
  newPrice: number;
  productName: string;
  currentPrice: number;
  type: 'product' | 'variation';
}

interface BackupItem {
  id: string;
  date: string;
  timestamp: number;
  map: Record<string, number>;
}

export default function BulkPriceUpdater() {
  const { products, bulkUpdatePrices } = useProducts();
  const [updates, setUpdates] = useState<PriceUpdate[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [backups, setBackups] = useState<BackupItem[]>([]);

  // Load backups on mount
  useEffect(() => {
    const saved = localStorage.getItem('dornika_price_backups');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBackups(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        console.error('Failed to parse backups', e);
      }
    }
  }, []);

  const saveBackups = (newBackups: BackupItem[]) => {
    const limited = newBackups.slice(0, 3); // Keep only last 3
    setBackups(limited);
    localStorage.setItem('dornika_price_backups', JSON.stringify(limited));
  };

  const downloadSampleExcel = () => {
    // Raw numbers without separators
    const sampleData = [
      ['CODE', 'PRICE'],
      ['DR-STR-PMP-15', 7500000],
      ['STR-PMP-10', 5500000],
      ['STR-PMP-20', 10000000],
      ['DR-NWP-16', 45000],
      ['NWP-PEX-20', 60000],
    ];
    const ws = XLSX.utils.aoa_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sample');
    XLSX.writeFile(wb, 'sample_prices.xlsx');
  };

  const downloadBackupExcel = (backup: BackupItem) => {
    const data: any[][] = [['CODE', 'PRICE']];
    for (const [code, price] of Object.entries(backup.map)) {
      data.push([code, price]); // Raw numbers
    }
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Backup');
    XLSX.writeFile(wb, `backup_prices_${backup.timestamp}.xlsx`);
  };

  const deleteBackup = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newBackups = backups.filter(b => b.id !== id);
    saveBackups(newBackups);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsProcessing(true);
    setUpdates([]);

    // Handle PDF files
    if (file.type === 'application/pdf') {
      await handlePdfUpload(file);
      return;
    }

    // Handle Excel files
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: ['A', 'B'], range: 1 });
        processExcelData(jsonData as any[]);
      } catch (err) {
        setError('خطا در خواندن فایل اکسل. لطفا از فرمت صحیح استفاده کنید.');
        setIsProcessing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handlePdfUpload = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;
      
      let extractedData: any[] = [];
      
      // Extract text from all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Combine text items
        const textItems = textContent.items.map((item: any) => item.str);
        const fullText = textItems.join(' ');
        
        // Try to extract CODE-PRICE pairs using regex
        // Looking for patterns like: DR-STR-PMP-15    100001
        const lines = fullText.split(/\n+/);
        
        for (const line of lines) {
          // Match patterns like: CODE    PRICE (alphanumeric code followed by number)
          const match = line.match(/([A-Z0-9\-]+)\s+(\d{4,})/);
          if (match) {
            extractedData.push({ A: match[1], B: parseInt(match[2]) });
          }
        }
      }
      
      if (extractedData.length === 0) {
        setError('هیچ داده‌ای در فایل PDF یافت نشد. لطفاً مطمئن شوید فایل شامل ستون‌های CODE و PRICE است. فرمت باید شبیه: CODE    PRICE باشد');
        setIsProcessing(false);
        return;
      }
      
      processExcelData(extractedData);
    } catch (err: any) {
      console.error('PDF parsing error:', err);
      setError(`خطا در خواندن فایل PDF: ${err.message || 'فایل نامعتبر است'}. لطفاً فایل معتبر آپلود کنید.`);
      setIsProcessing(false);
    }
  };

  const processExcelData = (data: any[]) => {
    const foundUpdates: PriceUpdate[] = [];
    const priceMap: Record<string, number> = {};

    data.forEach((row) => {
      const code = String(row.A || '').trim();
      const price = Number(row.B);

      if (code && !isNaN(price)) {
        priceMap[code] = price;
      }
    });

    products.forEach((product: any) => {
      if (product.sku && priceMap[product.sku] !== undefined) {
        foundUpdates.push({
          code: product.sku,
          newPrice: priceMap[product.sku],
          currentPrice: product.price,
          productName: product.name,
          type: 'product',
        });
      }

      if (product.variations) {
        product.variations.forEach((variation: any) => {
          variation.options.forEach((option: any) => {
            if (option.sku && priceMap[option.sku] !== undefined) {
              foundUpdates.push({
                code: option.sku,
                newPrice: priceMap[option.sku],
                currentPrice: option.price || product.price,
                productName: `${product.name} (${option.name})`,
                type: 'variation',
              });
            }
          });
        });
      }
    });

    setUpdates(foundUpdates);
    setIsProcessing(false);
    if (foundUpdates.length === 0) {
      setError('هیچ محصولی با کدهای وارد شده پیدا نشد.');
    }
  };

  const handleApplyUpdates = () => {
    // 1. Create Backup
    const backupMap: Record<string, number> = {};
    products.forEach((product: any) => {
      if (product.sku) backupMap[product.sku] = product.price;
      if (product.variations) {
        product.variations.forEach((variation: any) => {
          variation.options.forEach((option: any) => {
            if (option.sku) backupMap[option.sku] = option.price || product.price;
          });
        });
      }
    });

    const newBackup: BackupItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('fa-IR'),
      timestamp: Date.now(),
      map: backupMap
    };

    saveBackups([newBackup, ...backups]);

    // 2. Apply Updates
    const priceMap: Record<string, number> = {};
    updates.forEach((u) => {
      priceMap[u.code] = u.newPrice;
    });

    bulkUpdatePrices(priceMap);
    setIsConfirmed(true);
    setUpdates([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    setTimeout(() => setIsConfirmed(false), 5000);
  };

  return (
    <div className="bg-white rounded-2xl border border-border/50 overflow-hidden mb-6">
      <div 
        className="p-5 border-b border-border/50 bg-light-bg/30 flex items-center justify-between cursor-pointer hover:bg-light-bg/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-bold text-primary flex items-center gap-2">
          <RefreshCw className={`w-5 h-5 text-accent ${isProcessing ? 'animate-spin' : ''}`} />
          بروزرسانی دسته‌جمعی قیمت‌ها (Excel)
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              downloadSampleExcel();
            }}
            className="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-dark bg-white border border-accent/20 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            دانلود فایل نمونه
          </button>
          {isOpen ? <ChevronUp className="w-5 h-5 text-text-secondary" /> : <ChevronDown className="w-5 h-5 text-text-secondary" />}
        </div>
      </div>

      {isOpen && (
        <div className="p-6 animate-fade-in space-y-8">
          <p className="text-xs text-text-secondary -mt-2">
            فایل اکسل شامل ستون A (کد محصول) و ستون B (قیمت جدید - بدون جداکننده) را آپلود کنید.
          </p>

          {/* Backups List */}
          {backups.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                <Clock className="w-4 h-4" />
                بکاپ‌های اخیر (حداکثر ۳ مورد)
              </h4>
              <div className="grid gap-3">
                {backups.map((backup) => (
                  <div key={backup.id} className="flex items-center justify-between bg-blue-50/50 border border-blue-100 rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                        <Download className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">بکاپ قیمت‌ها</p>
                        <p className="text-xs text-slate-500">{backup.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => downloadBackupExcel(backup)}
                        className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-white border border-blue-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        دانلود اکسل
                      </button>
                      <button
                        onClick={(e) => deleteBackup(backup.id, e)}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف بکاپ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Area */}
          {!updates.length && !isConfirmed && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-2xl p-10 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all group"
            >
              <Upload className="w-12 h-12 text-text-secondary mx-auto mb-4 group-hover:text-accent group-hover:scale-110 transition-all" />
              <p className="font-bold text-primary mb-2">انتخاب فایل</p>
              <p className="text-sm text-text-secondary">فایل اکسل (.xlsx, .xls) یا PDF را بکشید و اینجا رها کنید</p>
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".xlsx, .xls, .pdf" 
                onChange={handleFileUpload}
                className="hidden" 
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3 text-red-700 text-sm animate-fade-in">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {isConfirmed && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center animate-fade-in">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6" />
              </div>
              <p className="font-bold text-green-800 mb-1">بروزرسانی با موفقیت انجام شد!</p>
              <p className="text-sm text-green-700">قیمت‌ها تغییر یافتند و یک بکاپ اکسل در لیست بالا ذخیره شد.</p>
            </div>
          )}

          {updates.length > 0 && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4">
                <div className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-amber-900 mb-1">تایید نهایی بروزرسانی</p>
                  <p className="text-sm text-amber-800">
                    تعداد <b>{updates.length.toLocaleString('fa-IR')}</b> محصول برای تغییر قیمت شناسایی شدند. 
                    پس از تایید، یک فایل بکاپ اکسل در لیست بالا ذخیره می‌شود.
                  </p>
                </div>
              </div>

              <div className="border border-border rounded-xl overflow-hidden max-h-[300px] overflow-y-auto cart-scroll">
                <table className="w-full text-sm text-right">
                  <thead className="bg-light-bg sticky top-0">
                    <tr>
                      <th className="px-4 py-3 font-bold">نام محصول / تنوع</th>
                      <th className="px-4 py-3 font-bold">کد</th>
                      <th className="px-4 py-3 font-bold">قیمت فعلی</th>
                      <th className="px-4 py-3 font-bold text-accent">قیمت جدید</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {updates.map((update, idx) => (
                      <tr key={idx} className="hover:bg-light-bg/30">
                        <td className="px-4 py-3 text-primary">{update.productName}</td>
                        <td className="px-4 py-3 font-mono" dir="ltr">{update.code}</td>
                        <td className="px-4 py-3 text-text-secondary">{update.currentPrice.toLocaleString('fa-IR')}</td>
                        <td className="px-4 py-3 font-bold text-accent">{update.newPrice.toLocaleString('fa-IR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleApplyUpdates}
                  className="flex-1 bg-primary text-white py-3.5 rounded-2xl font-bold text-base hover:bg-primary-light transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  تایید و اعمال تغییرات (ذخیره بکاپ)
                </button>
                <button
                  onClick={() => setUpdates([])}
                  className="px-8 bg-light-bg text-text-secondary rounded-2xl font-medium hover:bg-gray-200 transition-colors"
                >
                  انصراف
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
