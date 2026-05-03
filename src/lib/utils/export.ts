import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export async function exportBookingsToExcel(data: any[], startDate?: string, endDate?: string) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Laporan Transaksi");

  // 1. JUDUL LAPORAN
  worksheet.mergeCells("A1:H1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = "LAPORAN TRANSAKSI PENJUALAN - TITAN TRAVEL";
  titleCell.font = { name: "Arial", size: 16, bold: true };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };

  // 2. PERIODE
  worksheet.mergeCells("A2:H2");
  const periodCell = worksheet.getCell("A2");
  const startFmt = startDate ? format(new Date(startDate), "dd MMMM yyyy", { locale: id }) : "Semua Waktu";
  const endFmt = endDate ? format(new Date(endDate), "dd MMMM yyyy", { locale: id }) : "Sekarang";
  periodCell.value = `Periode: ${startFmt} s/d ${endFmt}`;
  periodCell.font = { name: "Arial", size: 10, italic: true };
  periodCell.alignment = { vertical: "middle", horizontal: "center" };

  worksheet.addRow([]); // Spacer

  // 3. HEADER TABEL
  const headerRow = worksheet.addRow(["NO", "TANGGAL", "PELANGGAN", "PAKET WISATA", "KENDARAAN", "PAX", "HARGA/PAX", "TOTAL BAYAR"]);
  headerRow.height = 25;
  
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0EA5E9" }, // primary-500
    };
    cell.font = { color: { argb: "FFFFFFFF" }, bold: true };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // 4. ISI DATA
  data.forEach((b, index) => {
    const amountPaid = Number(b.amountPaid);
    const pax = Number(b.pax);
    const pricePerPax = pax > 0 ? amountPaid / pax : 0;

    const rowData = [
      index + 1,
      format(new Date(b.createdAt), "dd/MM/yyyy"),
      b.name,
      (b.package?.title as any)?.id || "-",
      b.vehicleType?.name || "-",
      pax,
      pricePerPax,
      amountPaid,
    ];
    const row = worksheet.addRow(rowData);
    
    // Styling baris data
    row.getCell(1).alignment = { horizontal: "center" };
    row.getCell(2).alignment = { horizontal: "center" };
    row.getCell(5).alignment = { horizontal: "center" };
    row.getCell(6).alignment = { horizontal: "center" };
    row.getCell(7).numFmt = '"Rp" #,##0'; // Format Rupiah Per Pax
    row.getCell(8).numFmt = '"Rp" #,##0'; // Format Rupiah Total
    
    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  // 5. TOTAL
  const totalRevenue = data.reduce((sum, b) => sum + Number(b.amountPaid), 0);
  const footerRow = worksheet.addRow(["TOTAL PENDAPATAN", "", "", "", "", "", "", totalRevenue]);
  worksheet.mergeCells(`A${footerRow.number}:G${footerRow.number}`);
  
  footerRow.getCell(7).font = { bold: true };
  footerRow.getCell(7).alignment = { horizontal: "right" };
  footerRow.getCell(8).font = { bold: true, color: { argb: "FF0EA5E9" } };
  footerRow.getCell(8).numFmt = '"Rp" #,##0';
  
  footerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF8FAFC" }, // slate-50
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // 6. AUTO-WIDTH KOLOM
  worksheet.columns = [
    { width: 5 },  // No
    { width: 15 }, // Tanggal
    { width: 30 }, // Pelanggan
    { width: 40 }, // Paket
    { width: 15 }, // Kendaraan
    { width: 8 },  // Pax
    { width: 15 }, // Harga/Pax
    { width: 20 }, // Total Bayar
  ];

  // 7. GENERATE FILE
  const buffer = await workbook.xlsx.writeBuffer();
  const fileName = `Laporan_Transaksi_${format(new Date(), "yyyyMMdd_HHmm")}.xlsx`;
  saveAs(new Blob([buffer]), fileName);
}
