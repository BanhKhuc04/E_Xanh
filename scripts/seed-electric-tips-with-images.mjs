import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local via --env-file flag
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const email = process.env.SEED_USER_EMAIL;
const password = process.env.SEED_USER_PASSWORD;
const status = process.env.SEED_POST_STATUS || 'pending';

if (!supabaseUrl || !supabaseKey || !email || !password) {
  console.error('Missing required environment variables in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const postsData = [
  {
    title: 'Rút sạc khi không dùng có thật sự tiết kiệm điện?',
    slug: 'rut-sac-khi-khong-dung-co-that-su-tiet-kiem-dien',
    excerpt: 'Nhiều thiết bị vẫn tiêu thụ điện rất nhỏ khi cắm sạc. Việc rút sạc khi không dùng có mang lại lợi ích đáng kể, cả về tiết kiệm điện lẫn an toàn cháy nổ?',
    coverName: 'tip-charger-cover.webp',
    bodyName: 'tip-charger-body.svg',
    bodyText1: `Nhiều người trong chúng ta có thói quen cắm sạc điện thoại, laptop, hay tai nghe liên tục trên ổ điện, ngay cả khi thiết bị đã sạc đầy hoặc không còn kết nối. Thực tế, mặc dù không có thiết bị nào đang sạc, củ sạc vẫn tiếp tục tiêu thụ một lượng điện năng vô cùng nhỏ, thường được gọi là "điện chờ" (phantom load). 

Điều này xảy ra bởi vì các bộ sạc hiện đại chứa các mạch điện tử nhỏ luôn hoạt động để chờ kết nối. Khi bạn nhân lượng điện chờ này lên với hàng chục thiết bị trong một gia đình, và qua nhiều tháng, số tiền điện tăng thêm không phải là nhỏ.`,
    bodyText2: `Bên cạnh vấn đề chi phí, thói quen để cắm sạc liên tục còn tiềm ẩn nhiều rủi ro khác. Nhiệt độ của củ sạc thường ấm lên ngay cả khi không sạc, qua thời gian dài có thể làm giảm tuổi thọ linh kiện bên trong, hoặc nghiêm trọng hơn là gây nguy cơ chập cháy nếu ổ cắm không đảm bảo chất lượng.

Vậy giải pháp là gì? Hãy tập thói quen rút sạc ngay khi thiết bị đầy pin hoặc khi bạn ra khỏi nhà. Để tránh rườm rà, một mẹo nhỏ nhưng cực kỳ hiệu quả là sử dụng các loại ổ cắm kéo dài có công tắc riêng biệt cho từng lỗ cắm. Chỉ với một cú bấm, bạn đã ngắt hoàn toàn nguồn điện một cách an toàn và dứt khoát. Hãy bắt đầu thay đổi từ những chi tiết nhỏ nhất trong nhà bạn nhé!`,
  },
  {
    title: 'Cách dùng điều hòa mát mà không tốn điện quá nhiều',
    slug: 'cach-dung-dieu-hoa-mat-ma-khong-ton-dien-qua-nhieu',
    excerpt: 'Bí quyết sử dụng điều hòa đúng cách trong mùa hè giúp không gian luôn mát mẻ mà không làm tăng vọt hóa đơn tiền điện hàng tháng.',
    coverName: 'tip-air-conditioner-cover.webp',
    bodyName: 'tip-air-conditioner-body.svg',
    bodyText1: `Trong những ngày hè oi bức, điều hòa trở thành thiết bị không thể thiếu trong nhiều gia đình. Tuy nhiên, nó cũng là "thủ phạm" chính khiến hóa đơn tiền điện cuối tháng tăng chóng mặt. Vậy làm sao để vừa có không gian mát mẻ, vừa không phải "xót ví" mỗi lần đóng tiền điện?

Đầu tiên và quan trọng nhất là mức nhiệt độ lý tưởng. Nhiều người vừa bước vào phòng đã bật ngay mức 16-18 độ C với hy vọng phòng sẽ lạnh nhanh chóng. Thực tế, điều hòa phải làm việc với 100% công suất để kéo nhiệt độ phòng xuống mức này, tiêu tốn cực kì nhiều điện. Các chuyên gia khuyến cáo, mức nhiệt độ từ 26-28 độ C mới là lý tưởng nhất cho sức khỏe và túi tiền của bạn.`,
    bodyText2: `Thay vì để nhiệt độ quá thấp, hãy kết hợp sử dụng quạt điện. Quạt giúp luân chuyển không khí mát đi khắp phòng nhanh hơn, tạo cảm giác dễ chịu tức thì mà điện năng tiêu thụ lại thấp hơn nhiều lần so với việc giảm nhiệt độ điều hòa.

Một số lưu ý khác không kém phần quan trọng là hãy đảm bảo phòng của bạn được đóng kín cửa, và cửa sổ nên có rèm che nắng để tránh nhiệt độ bên ngoài hắt vào. Đừng quên vệ sinh lưới lọc định kỳ 1-2 lần mỗi tháng; lưới lọc bám bụi sẽ làm giảm hiệu suất làm lạnh đáng kể. Cuối cùng, hãy tập thói quen tắt điều hòa khoảng 30 phút trước khi rời khỏi phòng, vì hơi lạnh vẫn đủ giữ cho không gian mát mẻ trong khoảng thời gian đó.`,
  },
  {
    title: 'Tủ lạnh đặt sai chỗ có thể làm tốn điện hơn',
    slug: 'tu-lanh-dat-sai-cho-co-the-lam-ton-dien-hon',
    excerpt: 'Vị trí đặt tủ lạnh ảnh hưởng trực tiếp đến khả năng tản nhiệt và mức độ tiêu thụ điện. Đặt sai vị trí có thể khiến máy làm việc quá tải.',
    coverName: 'tip-fridge-cover.webp',
    bodyName: 'tip-fridge-body.svg',
    bodyText1: `Tủ lạnh là một trong số ít những thiết bị điện hoạt động liên tục 24/7 trong mọi gia đình. Chính vì tần suất hoạt động này, bất kỳ sự thiếu tối ưu nào cũng sẽ dẫn đến việc tiêu tốn nhiều điện năng hơn mức cần thiết. Bạn có biết, vị trí đặt tủ lạnh lại là một trong những yếu tố lớn nhất quyết định mức tiêu thụ điện của nó?

Nhiều gia đình, đặc biệt là ở những căn hộ có diện tích bếp nhỏ hẹp, thường cố gắng kê tủ lạnh sát vào tường để tiết kiệm tối đa không gian. Tuy nhiên, thiết kế của tủ lạnh đòi hỏi phải có không gian để hệ thống dàn nóng (thường ở phía sau và hai bên hông) tản nhiệt ra ngoài môi trường.`,
    bodyText2: `Khi bị kê quá sát vào tường, nhiệt độ không thể thoát ra nhanh chóng, khiến lốc máy phải hoạt động với công suất cao hơn bình thường để duy trì độ lạnh bên trong. Kết quả là tủ lạnh "ngốn" thêm điện mỗi ngày. Khoảng cách lý tưởng là để tủ lạnh cách tường và các vật dụng xung quanh ít nhất 10cm.

Bên cạnh vị trí, bạn cũng cần tránh đặt tủ lạnh gần các nguồn sinh nhiệt như bếp ga, lò vi sóng, lò nướng hoặc nơi có ánh nắng mặt trời trực tiếp chiếu vào. Về thói quen sử dụng, hãy sắp xếp thực phẩm gọn gàng, chừa không gian cho luồng khí lạnh lưu thông, không mở cửa tủ quá lâu và tuyệt đối không cho đồ ăn còn đang nóng hổi vào trong tủ lạnh.`,
  },
  {
    title: 'Dùng máy giặt thế nào để tiết kiệm điện và nước',
    slug: 'dung-may-giat-the-nao-de-tiet-kiem-dien-va-nuoc',
    excerpt: 'Những thói quen nhỏ khi dùng máy giặt giúp gia đình bạn tiết kiệm cả điện lẫn nước một cách hiệu quả, đồng thời bảo vệ quần áo bền lâu.',
    coverName: 'tip-washing-machine-cover.webp',
    bodyName: 'tip-washing-machine-body.svg',
    bodyText1: `Máy giặt hiện đại ngày nay được trang bị rất nhiều tính năng tiện ích, nhưng đi kèm với đó cũng là lượng tiêu thụ điện và nước không hề nhỏ nếu sử dụng sai cách. Bằng việc điều chỉnh một chút thói quen giặt giũ, bạn không chỉ tiết kiệm được tài nguyên mà còn giúp thiết bị hoạt động bền bỉ hơn.

Lỗi phổ biến nhất là giặt quá ít hoặc quá nhiều đồ trong một mẻ. Giặt 1-2 bộ quần áo cũng tiêu tốn lượng nước và điện gần tương đương với một mẻ giặt đầy. Ngược lại, nếu cố nhồi nhét quá công suất của máy, lồng giặt sẽ không đủ không gian xoay, quần áo không sạch và động cơ máy phải chịu tải nặng, dễ dẫn đến hỏng hóc. Lời khuyên là hãy gom đồ giặt vừa đủ khoảng 70-80% thể tích lồng giặt.`,
    bodyText2: `Việc lựa chọn chế độ giặt cũng đóng vai trò quan trọng. Nếu quần áo chỉ dính mồ hôi hoặc không có vết bẩn cứng đầu, hãy mạnh dạn sử dụng chế độ giặt nhanh (Quick Wash) thay vì chế độ tiêu chuẩn kéo dài. Thời gian giặt ngắn hơn đồng nghĩa với việc tiêu thụ ít năng lượng hơn.

Ngoài ra, hãy đặc biệt chú ý đến tính năng giặt bằng nước nóng. Trừ khi bạn cần giặt khăn tắm, ga trải giường để diệt khuẩn hoặc xử lý vết bẩn dầu mỡ nặng, phần lớn quần áo thông thường chỉ cần giặt ở nhiệt độ thường là đủ sạch. Đun nóng nước là công đoạn tốn điện nhất của máy giặt. Đừng quên vệ sinh lồng giặt định kỳ để loại bỏ cặn bẩn, giúp máy hoạt động trơn tru.`,
  },
  {
    title: 'Thay bóng đèn LED có đáng không?',
    slug: 'thay-bong-den-led-co-dang-khong',
    excerpt: 'So sánh hiệu quả của bóng đèn LED so với các loại bóng đèn truyền thống như huỳnh quang hay sợi đốt, và lý do bạn nên chuyển đổi ngay hôm nay.',
    coverName: 'tip-led-cover.webp',
    bodyName: 'tip-led-body.svg',
    bodyText1: `Hệ thống chiếu sáng chiếm một phần không nhỏ trong hóa đơn tiền điện hàng tháng, đặc biệt là ở những gia đình sử dụng bóng đèn cũ hoặc có nhu cầu thắp sáng nhiều vào buổi tối. Mặc dù công nghệ đèn LED đã phổ biến nhiều năm nay, một số người vẫn e ngại chuyển đổi vì chi phí mua ban đầu của đèn LED thường đợt cao hơn so với đèn sợi đốt hoặc huỳnh quang (compact).

Tuy nhiên, nếu xét trên bài toán kinh tế lâu dài, việc thay thế sang đèn LED là một quyết định hoàn toàn xứng đáng. Về mặt hiệu suất, bóng đèn LED tiêu thụ ít điện năng hơn tới 80% so với đèn sợi đốt và khoảng 40-50% so với đèn huỳnh quang để tạo ra cùng một độ sáng.`,
    bodyText2: `Tuổi thọ cũng là một điểm sáng giá. Một bóng đèn LED trung bình có thể hoạt động từ 25,000 đến 50,000 giờ, cao gấp nhiều lần so với các loại đèn cũ. Điều này giúp bạn tiết kiệm đáng kể chi phí thay thế bóng mới và công sức sửa chữa. Ngoài ra, đèn LED khi hoạt động tỏa ra lượng nhiệt rất nhỏ, không làm nóng không gian, gián tiếp giúp điều hòa không khí giảm bớt tải trọng làm mát.

Bạn không nhất thiết phải vứt bỏ tất cả đèn cũ để thay mới cùng một lúc. Lời khuyên là hãy bắt đầu thay thế ở những khu vực mà bạn bật đèn nhiều nhất: phòng khách, không gian bếp, và phòng làm việc. Hãy lựa chọn các thương hiệu uy tín, chú ý đến công suất (Watt) và màu sắc ánh sáng (vàng ấm cho phòng ngủ, trắng sáng cho góc làm việc) để tối ưu hóa không gian sống.`,
  },
  {
    title: 'Những thiết bị nên tắt hẳn trước khi đi ngủ',
    slug: 'nhung-thiet-bi-nen-tat-han-truoc-khi-di-ngu',
    excerpt: 'Danh sách các thiết bị bạn nên ngắt điện hoàn toàn vào ban đêm thay vì chỉ tắt bằng điều khiển, giúp tiết kiệm điện và đảm bảo an toàn tuyệt đối.',
    coverName: 'tip-night-devices-cover.webp',
    bodyName: 'tip-night-devices-body.svg',
    bodyText1: `Khi cả gia đình chìm vào giấc ngủ, căn nhà trông có vẻ im lìm, nhưng thực tế, hàng tá thiết bị điện tử vẫn đang âm thầm "ngốn" điện. Hầu hết chúng ta có thói quen chỉ tắt tivi bằng điều khiển từ xa, để máy tính ở chế độ Sleep (ngủ), hoặc cắm nguyên dàn âm thanh và đèn trang trí thâu đêm suốt sáng.

Khi thiết bị ở chế độ chờ (Standby), chúng vẫn duy trì một lượng điện năng nhất định để sẵn sàng nhận tín hiệu khởi động lại, hoặc để duy trì các đèn LED hiển thị trạng thái. Quá trình này, nếu diễn ra suốt 7-8 tiếng ban đêm và kéo dài 365 ngày, sẽ tạo ra một sự lãng phí tài nguyên không hề nhỏ. Hơn nữa, việc duy trì điện trong các thiết bị cũ có thể tiềm ẩn nguy cơ chập mạch, cháy nổ, đặc biệt là vào những đêm hè điện áp thay đổi đột ngột.`,
    bodyText2: `Vậy bạn nên tắt hẳn những thiết bị nào trước khi đi ngủ? Danh sách ưu tiên bao gồm: Tivi, bộ giải mã (set-top box), dàn loa âm thanh, máy tính để bàn (PC), cục sạc thiết bị di động, và các loại đèn trang trí không cần thiết. Ngược lại, những thiết bị như tủ lạnh hay router Wi-Fi (nếu phục vụ cho camera an ninh hoặc thiết bị thông minh) thì vẫn cần được duy trì hoạt động.

Một giải pháp thực tế và không gây lười biếng là sử dụng ổ cắm điện kéo dài có công tắc chung cho từng khu vực. Chẳng hạn, một ổ cắm chuyên dùng cho góc giải trí (TV, loa, đầu thu). Trước khi đi ngủ, bạn chỉ việc ấn một nút công tắc trên ổ cắm là đã ngắt điện hoàn toàn cả cụm thiết bị, vừa đảm bảo an toàn, vừa yên tâm tiết kiệm được điện năng tối đa cho gia đình.`,
  }
];

function generateBodySVG(title, filename) {
  // A simple but neat SVG illustration for body content
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">
    <rect width="800" height="450" rx="16" fill="#F1F8E9" />
    <circle cx="400" cy="225" r="180" fill="#DCEDC8" opacity="0.6" />
    <path d="M 250 350 L 550 350 L 400 100 Z" fill="#AED581" opacity="0.4" />
    <rect x="300" y="200" width="200" height="150" rx="10" fill="#81C784" opacity="0.8" />
    <circle cx="400" cy="275" r="40" fill="#4CAF50" />
    <text x="400" y="410" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="28" font-weight="bold" fill="#388E3C" text-anchor="middle">
      Hình minh họa: ${title}
    </text>
    <!-- Simple top-left branding -->
    <rect x="30" y="30" width="120" height="40" rx="20" fill="#4CAF50" />
    <text x="90" y="56" font-family="sans-serif" font-size="16" font-weight="bold" fill="#FFF" text-anchor="middle">E-XANH</text>
  </svg>`;

  const outPath = path.resolve(__dirname, '../public/demo-posts/body', filename);
  fs.writeFileSync(outPath, svg);
  console.log(`[Generated] Body Image: ${filename}`);
}

async function run() {
  const coversDir = path.resolve(__dirname, '../public/demo-posts/covers');
  const bodyDir = path.resolve(__dirname, '../public/demo-posts/body');

  if (!fs.existsSync(coversDir)) fs.mkdirSync(coversDir, { recursive: true });
  if (!fs.existsSync(bodyDir)) fs.mkdirSync(bodyDir, { recursive: true });

  console.log('Generating body images...');
  for (const post of postsData) {
    generateBodySVG(post.title, post.bodyName);
  }

  console.log('Signing in to Supabase...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) {
    console.error('Login failed:', authError.message);
    process.exit(1);
  }

  const authorId = authData.user?.id || authData.session?.user?.id;
  console.log(`Logged in as: ${authorId}`);

  console.log('Validating files and Upserting posts...');
  for (const post of postsData) {
    const coverPath = path.resolve(coversDir, post.coverName);
    const bodyPath = path.resolve(bodyDir, post.bodyName);

    if (!fs.existsSync(coverPath)) {
      console.error(`[Error] Cover image missing: ${post.coverName}. Skipping post: ${post.title}`);
      continue;
    }

    if (!fs.existsSync(bodyPath)) {
      console.error(`[Error] Body image missing: ${post.bodyName}. Skipping post: ${post.title}`);
      continue;
    }

    const contentBlocks = [
      { type: 'text', content: post.bodyText1 },
      { type: 'image', url: `/demo-posts/body/${post.bodyName}` },
      { type: 'text', content: post.bodyText2 }
    ];

    const contentPlain = post.bodyText1 + '\\n\\n' + post.bodyText2;

    const payload = {
      author_id: authorId,
      title: post.title,
      slug: post.slug,
      description: post.excerpt,
      content: contentPlain,
      content_blocks: contentBlocks,
      type: 'tip',
      status: status,
      image_url: `/demo-posts/covers/${post.coverName}`
    };

    // Check if exists
    const { data: existingPost } = await supabase
      .from('posts')
      .select('id')
      .eq('slug', post.slug)
      .single();

    if (existingPost) {
      // Update
      const { data, error } = await supabase
        .from('posts')
        .update(payload)
        .eq('id', existingPost.id)
        .select();

      if (error) {
        console.error(`Error updating post '${post.title}':`, error);
      } else {
        console.log(`[Updated] Post '${post.title}'. ID: ${data[0].id}`);
      }
    } else {
      // Insert
      const { data, error } = await supabase
        .from('posts')
        .insert([payload])
        .select();

      if (error) {
        console.error(`Error inserting post '${post.title}':`, error);
      } else {
        console.log(`[Inserted] Post '${post.title}'. ID: ${data[0].id}`);
      }
    }
  }

  console.log('Seed task completed successfully!');
  process.exit(0);
}

run();
