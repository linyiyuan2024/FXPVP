const fs = require('fs');

const fileAPath = 'name.txt'; // 替换后的新字符串来源文件路径
const fileBPath = 'oldn.txt'; // 要替换的旧字符串来源文件路径
const fileCPath = 'cmcl.json'; // 被替换的文件路径

// 读取文件A的内容（新字符串）
fs.readFile(fileAPath, 'utf8', (err, newData) => {
  if (err) throw err;

  // 读取文件B的内容（旧字符串）
  fs.readFile(fileBPath, 'utf8', (err, oldData) => {
    if (err) throw err;

    // 读取文件C的内容
    fs.readFile(fileCPath, 'utf8', (err, fileCData) => {
      if (err) throw err;

      // 执行替换操作
      const replacedData = fileCData.replace(new RegExp(oldData, 'g'), newData);

      // 将替换后的内容写入文件C
      fs.writeFile(fileCPath, replacedData, 'utf8', (err) => {
        if (err) throw err;
        console.log('改名成功');
      });
    });
  });
});
