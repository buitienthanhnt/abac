<p class="d-flex align-items-center m-0">
        
        <i class="fa-solid fa-caret-up" style="color: #008c72"></i>
                        <span class="fs-3" style="color: #008c72">
                            1.1%
                        </span>
        <span>&nbsp;từ cuối ng&#224;y h&#244;m qua</span>
    </p>
    <p class="m-0">
        
        Cập nhật lần cuối l&#250;c 09/07/2026 18:24
    </p>


    const htmlString = `<div class="content">Nội dung lấy bằng Regex</div>`;

const getContentByRegex = (html, className) => {
  // Tạo pattern tìm kiếm thẻ div có class tương ứng
  const regex = new RegExp(`<div[^>]*class=["']${className}["'][^>]*>([\\s\\S]*?)<\/div>`, 'i');
  const match = html.match(regex);
  
  if (match && match[1]) {
    // Loại bỏ các thẻ HTML con bên trong nếu có để lấy text thuần
    return match[1].replace(/<[^>]*>/g, '').trim();
  }
  return "";
};

const result = getContentByRegex(htmlString, 'content');
console.log(result); // "Nội dung lấy bằng Regex"



const htmlString = `<div class="content" style="margin-top: 20px; color: red;">Nội dung</div>`;

const getStyleByRegex = (html, className) => {
  // Regex tìm thẻ div có class chỉ định và trích xuất thuộc tính style bên trong thẻ đó
  const regex = new RegExp(`<span[^>]*class=["']${className}["'][^>]*style=["']([^"color: ']*)["'][^>]*>`, 'i');
  const match = html.match(regex);
  
  // match[1] sẽ chứa nội dung nằm trong dấu nháy của style=""
  return match ? match[1] : "";
};

const styleString = getStyleByRegex(htmlString, 'content');
console.log(styleString); // "margin-top: 20px; color: red;"
