const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting deployment...');

try {
  // dist 폴더 정리
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // dist 폴더 생성
  fs.mkdirSync('dist');

  // 필요한 파일들 복사
  const filesToCopy = ['index.html', 'style.css', 'script.js', 'data.js'];
  filesToCopy.forEach(file => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join('dist', file));
      console.log(`✅ Copied ${file}`);
    }
  });

  // images 폴더 복사
  if (fs.existsSync('images')) {
    const copyDir = (src, dest) => {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      const entries = fs.readdirSync(src, { withFileTypes: true });
      entries.forEach(entry => {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
          copyDir(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      });
    };
    copyDir('images', path.join('dist', 'images'));
    console.log('✅ Copied images folder');
  }

  // Git 작업
  process.chdir('dist');

  execSync('git init');
  execSync('git add .');
  execSync('git commit -m "Deploy to GitHub Pages"');
  execSync('git branch -M gh-pages');
  execSync('git remote add origin https://github.com/danbinaerinHan/danbinaerinhan.git');
  execSync('git push -f origin gh-pages');

  // 정리
  process.chdir('..');
  fs.rmSync('dist', { recursive: true, force: true });

  console.log('✅ Deployment completed!');
  console.log('🌐 Visit: https://danbinaerinhan.github.io/danbinaerinhan/');

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
