import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local via --env-file flag
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Posts data
const postsData = [
  {
    title: 'Rút sạc khi không dùng có thật sự tiết kiệm điện?',
    slug: 'rut-sac-khi-khong-dung-co-that-su-tiet-kiem-dien',
    type: 'tip',
    status: 'pending', // or approved based on requirements, using pending
    imageName: 'tip-charger-standby.svg',
    description: 'Nhiều thiết bị vẫn tiêu thụ điện rất nhỏ khi cắm sạc. Việc rút sạc khi không dùng có thật sự mang lại lợi ích đáng kể không?',
    content: `
      Nhiều người có thói quen cắm sạc điện thoại, laptop liên tục trên ổ điện ngay cả khi không sử dụng. Thực tế, nhiều thiết bị vẫn tiêu thụ một lượng điện nhỏ (gọi là điện chờ) khi cắm sạc mà không kết nối với thiết bị.

      Mặc dù lượng điện tiêu thụ này không lớn, nhưng nếu nhân lên với nhiều thiết bị trong nhà và qua một thời gian dài, nó cũng góp phần làm tăng hóa đơn tiền điện của bạn. Hơn nữa, việc cắm sạc liên tục còn làm tăng nguy cơ chập cháy, giảm tuổi thọ của củ sạc.

      Vì vậy, nên tập thói quen rút sạc điện thoại, laptop, tai nghe khi không dùng đến. Để tiện lợi hơn, bạn có thể sử dụng các loại ổ cắm có công tắc riêng biệt. Khi không dùng, chỉ cần tắt công tắc là có thể ngắt điện hoàn toàn, vừa an toàn vừa tiết kiệm điện hiệu quả.
    `,
  },
  {
    title: 'Cách dùng điều hòa mát mà không tốn điện quá nhiều',
    slug: 'cach-dung-dieu-hoa-mat-ma-khong-ton-dien-qua-nhieu',
    type: 'tip',
    status: 'pending',
    imageName: 'tip-air-conditioner.svg',
    description: 'Bí quyết sử dụng điều hòa trong mùa hè giúp không gian luôn mát mẻ mà không làm tăng vọt hóa đơn tiền điện.',
    content: `
      Trong những ngày hè oi bức, điều hòa là cứu tinh nhưng cũng là "thủ phạm" chính làm tăng vọt hóa đơn tiền điện. Tuy nhiên, nếu biết cách sử dụng, bạn hoàn toàn có thể tận hưởng không khí mát mẻ mà không lo xót ví.

      Đầu tiên, không nên cài đặt nhiệt độ quá thấp (dưới 24 độ C). Nhiệt độ lý tưởng và tiết kiệm điện nhất là từ 26-28 độ C. Việc giảm nhiệt độ xuống quá thấp không làm phòng mát nhanh hơn bao nhiêu nhưng lại tiêu tốn rất nhiều điện năng.

      Nên kết hợp sử dụng quạt gió cùng với điều hòa để luồng khí mát được phân bổ đều khắp phòng. Hãy đảm bảo đóng kín các cửa ra vào và cửa sổ để hơi lạnh không bị thoát ra ngoài. Đừng quên vệ sinh lưới lọc của điều hòa định kỳ (1-2 lần/tháng) để máy hoạt động trơn tru và hiệu quả hơn. Ngoài ra, hãy tắt điều hòa khoảng 20-30 phút trước khi bạn định rời khỏi phòng.
    `,
  },
  {
    title: 'Tủ lạnh đặt sai chỗ có thể làm tốn điện hơn',
    slug: 'tu-lanh-dat-sai-cho-co-the-lam-ton-dien-hon',
    type: 'tip',
    status: 'pending',
    imageName: 'tip-fridge-placement.svg',
    description: 'Vị trí đặt tủ lạnh ảnh hưởng trực tiếp đến khả năng tản nhiệt và mức độ tiêu thụ điện của thiết bị này.',
    content: `
      Tủ lạnh là thiết bị hoạt động 24/7, vì vậy việc đặt tủ lạnh đúng vị trí là rất quan trọng để đảm bảo hiệu suất làm lạnh và tiết kiệm điện.

      Nhiều gia đình thường kê tủ lạnh sát vào tường để tiết kiệm không gian. Tuy nhiên, điều này làm cản trở quá trình tản nhiệt của dàn nóng ở phía sau và hai bên tủ. Khi không thoát được nhiệt, lốc máy phải hoạt động với công suất cao hơn, dẫn đến tiêu tốn nhiều điện năng hơn.

      Nên đặt tủ lạnh cách tường ít nhất 10cm và tránh xa các nguồn nhiệt như bếp ga, lò vi sóng hoặc ánh nắng mặt trời chiếu trực tiếp. Trong quá trình sử dụng, hạn chế mở cửa tủ lạnh quá lâu hoặc quá thường xuyên. Không cho thức ăn còn đang nóng vào tủ và cần sắp xếp thực phẩm vừa phải, khoa học để luồng khí lạnh dễ dàng lưu thông đến mọi ngóc ngách.
    `,
  },
  {
    title: 'Dùng máy giặt thế nào để tiết kiệm điện và nước',
    slug: 'dung-may-giat-the-nao-de-tiet-kiem-dien-va-nuoc',
    type: 'tip',
    status: 'pending',
    imageName: 'tip-washing-machine.svg',
    description: 'Những thói quen nhỏ khi dùng máy giặt giúp gia đình bạn tiết kiệm cả điện lẫn nước một cách hiệu quả.',
    content: `
      Máy giặt là thiết bị tiêu thụ khá nhiều điện và nước. Tuy nhiên, chỉ với vài thói quen đơn giản, bạn có thể tối ưu hiệu quả sử dụng.

      Thứ nhất, hãy gom đủ quần áo cho một mẻ giặt tương ứng với công suất của máy (ví dụ 7kg, 8kg). Việc giặt quá ít đồ trong một mẻ sẽ làm lãng phí điện nước, trong khi nhồi nhét quá nhiều sẽ làm quần áo không sạch và gây hại cho động cơ.

      Thứ hai, hãy chọn chế độ giặt phù hợp với loại vải và độ bẩn của quần áo. Nếu quần áo không quá bẩn, hãy chọn chế độ giặt nhanh. Đặc biệt, nên hạn chế sử dụng chức năng giặt bằng nước nóng nếu không thực sự cần thiết, vì chức năng làm nóng nước tiêu thụ điện năng rất lớn. Cuối cùng, hãy thường xuyên vệ sinh lồng giặt để máy luôn trong trạng thái hoạt động tốt nhất.
    `,
  },
  {
    title: 'Thay bóng đèn LED có đáng không?',
    slug: 'thay-bong-den-led-co-dang-khong',
    type: 'tip',
    status: 'pending',
    imageName: 'tip-led-light.svg',
    description: 'So sánh hiệu quả của bóng đèn LED so với các loại bóng đèn truyền thống và lý do bạn nên chuyển đổi.',
    content: `
      Nhiều người vẫn còn do dự khi chuyển sang sử dụng bóng đèn LED do chi phí mua ban đầu thường cao hơn so với đèn sợi đốt hoặc huỳnh quang. Tuy nhiên, xét về lâu dài, việc đầu tư này là hoàn toàn xứng đáng.

      Đèn LED tiết kiệm điện năng đến 80% so với đèn sợi đốt và khoảng 40-50% so với đèn compact. Một ưu điểm nổi bật khác là đèn LED tỏa nhiệt rất ít, giúp giảm tải cho hệ thống làm mát không khí trong nhà. Hơn nữa, tuổi thọ của đèn LED có thể lên đến hàng chục nghìn giờ, gấp nhiều lần các loại đèn truyền thống.

      Bạn không cần phải thay thế toàn bộ đèn trong nhà cùng lúc. Hãy ưu tiên thay trước ở những khu vực thường xuyên sử dụng ánh sáng như phòng khách, phòng bếp, phòng làm việc hoặc bàn học sinh. Khi chọn mua, cần lưu ý đến công suất và màu sắc ánh sáng (vàng, trắng ấm, trắng sáng) để phù hợp với từng không gian.
    `,
  },
  {
    title: 'Những thiết bị nên tắt hẳn trước khi đi ngủ',
    slug: 'nhung-thiet-bi-nen-tat-han-truoc-khi-di-ngu',
    type: 'tip',
    status: 'pending',
    imageName: 'tip-night-devices.svg',
    description: 'Danh sách các thiết bị bạn nên ngắt điện hoàn toàn vào ban đêm để tiết kiệm điện năng và đảm bảo an toàn.',
    content: `
      Vào ban đêm khi mọi người đi ngủ, nhiều thiết bị trong nhà vẫn âm thầm tiêu thụ điện năng nếu chỉ được tắt bằng điều khiển (chế độ chờ). 

      Để tiết kiệm điện tối đa, bạn nên ngắt điện hoàn toàn các thiết bị như: TV, dàn âm thanh, máy tính để bàn, bộ sạc điện thoại, và các loại đèn trang trí. Việc tắt hẳn nguồn điện không chỉ giúp tiết kiệm chi phí mà còn giảm thiểu rủi ro chập điện, cháy nổ, đặc biệt là trong những ngày hè nhiệt độ tăng cao.

      Một giải pháp cực kỳ tiện lợi là sử dụng các loại ổ cắm điện có công tắc riêng. Thay vì phải đi rút từng phích cắm, bạn chỉ cần một thao tác bấm công tắc để ngắt toàn bộ điện cho khu vực giải trí (TV, loa) hay góc làm việc. Tất nhiên, với những thiết bị thiết yếu như tủ lạnh hay router Wi-Fi (nếu cần thiết), bạn vẫn nên để hoạt động bình thường.
    `,
  }
];

function generateSVG(title, filename) {
  const words = title.split(' ');
  let line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
  let line2 = words.slice(Math.ceil(words.length / 2)).join(' ');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720">
  <rect width="1280" height="720" fill="#E8F5E9" />
  <!-- Simple decorative element -->
  <circle cx="150" cy="150" r="300" fill="#C8E6C9" opacity="0.5" />
  <circle cx="1130" cy="570" r="250" fill="#A5D6A7" opacity="0.3" />
  
  <text x="640" y="320" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="64" font-weight="bold" fill="#2E7D32" text-anchor="middle">
    ${line1}
  </text>
  <text x="640" y="410" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="64" font-weight="bold" fill="#2E7D32" text-anchor="middle">
    ${line2}
  </text>
  
  <!-- Category Tag -->
  <rect x="520" y="180" width="240" height="50" rx="25" fill="#4CAF50" />
  <text x="640" y="215" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="24" font-weight="bold" fill="#FFFFFF" text-anchor="middle">
    MẸO TIẾT KIỆM
  </text>
  
  <!-- Branding -->
  <text x="640" y="650" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="32" font-weight="bold" fill="#388E3C" text-anchor="middle" letter-spacing="4">
    E-XANH
  </text>
</svg>`;

  const outPath = path.resolve(__dirname, '../public/demo-posts', filename);
  fs.writeFileSync(outPath, svg);
  console.log(`Created SVG: ${filename}`);
}

async function run() {
  console.log('Generating cover images...');
  for (const post of postsData) {
    generateSVG(post.title, post.imageName);
  }

  console.log('Signing in to Supabase...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'vanhkhuc2k5@gmail.com',
    password: 'vanhkhuc'
  });

  if (authError) {
    console.error('Login failed:', authError.message);
    process.exit(1);
  }

  const authorId = authData.user?.id || authData.session?.user?.id;
  console.log('Logged in as:', authorId);

  console.log('Inserting posts...');
  for (const post of postsData) {
    const payload = {
      author_id: authorId,
      title: post.title,
      slug: post.slug,
      description: post.description,
      content: post.content,
      type: post.type,
      status: post.status,
      image_url: `/demo-posts/${post.imageName}`,
    };

    const { data, error } = await supabase
      .from('posts')
      .insert([payload])
      .select();

    if (error) {
      // Check if it's a unique constraint error on slug
      if (error.code === '23505') {
        console.log(`[Skipped] Post '${post.title}' already exists (slug conflict).`);
      } else {
        console.error(`Error inserting post '${post.title}':`, error);
      }
    } else {
      console.log(`[Success] Inserted post '${post.title}'. ID: ${data[0].id}`);
    }
  }

  console.log('Done!');
  process.exit(0);
}

run();
