import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import * as ExcelJS from "exceljs";


export const createDownLoadData = async () => {
  const url = await handleExport();
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", url);
  downloadAnchorNode.setAttribute("download", "file_mau.xlsx");
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

const handleExport = async () => {
  
    const wb = new ExcelJS.Workbook();  
   
     

        // excelJS

        const sheet2 = wb.addWorksheet();

     
        sheet2.getCell("A1").value ="Title";
        sheet2.getCell("A2").value ="Kem Chống Nắng La Roche-Posay Kiểm Soát Dầu SPF50+ 50ml Anthelios Anti-Shine Gel-Cream Dry Touch Finish Mattifying Effect SPF50+";
        sheet2.getCell("A3").value ="Son Lì Shu Uemura Matte OR570 Màu Đỏ Cam 3g";
        sheet2.getCell("A4").value ="Trà Giảm Cân Orihiro Night Diet Tea 20 Gói/ Túi";
        sheet2.getCell("A5").value ="Sữa Chống Nắng Anessa Cho Da Nhạy Cảm & Trẻ Em 60ml";
        sheet2.getCell("B1").value ="Price";
        sheet2.getCell("B2").value ="12";
        sheet2.getCell("B3").value ="23";
        sheet2.getCell("B4").value ="100";
        sheet2.getCell("B5").value ="56";
        sheet2.getCell("C1").value ="Description";
        sheet2.getCell("C2").value ="Kem Chống Nắng La Roche-Posay Anthelios Anti-Shine Gel-Cream Dry Touch Finish Mattifying Effect SPF50+ đến từ thương hiệu dược mỹ phẩm La Roche-Posay là sản phẩm kem chống nắng dành cho làn da dầu mụn, sở hữu công nghệ cải tiến XL-Protect cùng kết cấu kem gel dịu nhẹ & không nhờn rít, giúp ngăn ngừa tia UVA/UVB + tia hồng ngoại + tác hại từ ô nhiễm, bảo vệ toàn diện cho làn da luôn khỏe mạnh.";
        sheet2.getCell("C3").value ="Son Lì Shu Uemura Rouge Unlimited Matte 3g từ thương hiệu Shu Uemura của Nhật Bản là dòng son trang điểm môi cao cấp với sự kết hợp hoàn mỹ giữa chất son lì thượng hạng và kết cấu mịn nhẹ như nhung, cho sắc son được bền màu mà vẫn duy trì cảm giác thoải mái, nhẹ nhàng suốt ngày dài. Đặc biệt, công nghệ khuếch tán hạt sắc tố màu mang lại màu sắc thuần túy, cho đôi môi bùng nổ màu sắc đầy cá tính khiến các nàng không khỏi ngất ngây.";
        sheet2.getCell("C4").value ="Trà Giảm Cân Orihiro Night Diet Tea 20 Gói/ Túi là sản phẩm hỗ trợ sức khỏe đến từ thương hiệu Orihiro của Nhật Bản chứa thành phần cỏ ngọt, đây là dược liệu có khả năng giảm cân hiệu quả nhờ chất ngọt không chuyển hóa thành chất béo tích tụ trong cơ thể, lại ít năng lượng, không lên men, không phân hủy là một trong những thực phẩm hỗ trợ giảm cân tích cực. Sản phẩm có khả năng thúc đẩy quá trình đốt cháy mỡ thừa giảm cân hiệu quả, giúp nhuận tràng, tăng cường tiêu hóa, trao đổi chất, thanh nhiệt giải độc, cơ thể khỏe mạnh, ngủ ngon.";
        sheet2.getCell("C5").value ="Sữa Chống Nắng Anessa Perfect UV Sunscreen Mild Milk SPF50+/ PA++++ là dòng sản phẩm chống nắng đến từ thương hiệu Anessa (thuộc tập đoàn Shiseido) - thương hiệu chống nắng được yêu thích hàng đầu tại Nhật Bản trong suốt 20 năm liền. Sản phẩm giúp bảo vệ da tối ưu với kết cấu mỏng nhẹ và thành phần 5 Không (không màu, không mùi, không cồn, không dầu khoáng và không paraben), phù hợp cho cả da nhạy cảm và da trẻ em từ 1 tuổi. Đặc biệt, công thức chứa 50% thành phần dưỡng da giúp bảo vệ da khỏi thương tổn do tia UV và hạt siêu vi trong không khí.";
        sheet2.getCell("D1").value ="In Stock";
        sheet2.getCell("D2").value ="12";
        sheet2.getCell("D3").value ="2000";
        sheet2.getCell("D4").value ="2500";
        sheet2.getCell("D5").value ="300";
        sheet2.getCell("E1").value ="Category";
        sheet2.getCell("E2").value ="Skin Care";
        sheet2.getCell("E3").value ="Make Up";
        sheet2.getCell("E4").value ="Internal Body";
        sheet2.getCell("E5").value ="Body&Hair";
        sheet2.getCell("F1").value ="URL image";
        sheet2.getCell("F2").value ="https://media.hasaki.vn/wysiwyg/HaNguyen1/kem-chong-nang-la-roche-posay-kiem-soat-dau-spf50-50ml-05.jpg";
        sheet2.getCell("F3").value ="https://media.hasaki.vn/wysiwyg/HaNguyen/son-thoi-li-co-duong-shu-uemura-04.jpg";
        sheet2.getCell("F4").value ="https://api.hasaki.vn/wysiwyg?id=e3ttZWRpYSB1cmw9Ind5c2l3eWcvQ2hhdS90cmEtZ2lhbS1jYW4tb3JpaGlyby1uaWdodC1kaWV0LXRlYS0yMC1nb2ktdHVpLTEuanBnIn19/";
        sheet2.getCell("F5").value ="https://media.hasaki.vn/wysiwyg/HaNguyen/sua-chong-nang-anessa-cho-da-nhay-cam-tre-em-60ml_mau-moi-2021.jpg";


        // sheet2.mergeCells("A1:A2");
        


      
    

    const workbookBlob = await wb.xlsx.writeBuffer();


    const blob = new Blob([workbookBlob], {
      type: "application/octet-stream",
    });
    return addStyles(blob);
  
};

const addStyles = (workbookBlob) => {
  return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
    
    return workbook
      .outputAsync()
      .then((workbookBlob) => URL.createObjectURL(workbookBlob));
  });
};
