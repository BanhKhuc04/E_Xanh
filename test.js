import { getTipPosts } from './src/services/postService.js'; getTipPosts({page: 1, limit: 10}).then(res => console.log(JSON.stringify(res, null, 2))).catch(console.error);
