import path from 'path';
import { getPackages } from '@manypkg/get-packages';

export async function getTutorialData(id) {
  //   const fullPath = path.join(postsDirectory, `${id}.mdx`);
  //   const fileContents = fs.readFileSync(fullPath, 'utf-8');
  //   const { data } = matter(fileContents);
  //   const jsx = await mdx(fileContents);
  // const processedContent = await remark()
  //   .use(html)
  //   .process(matterResult.content);

  // const contentHTML = processedContent.toString();
  //   return {
  //     id,
  //     contentHTML: jsx,
  //     ...data,
  //   };
  return undefined;
}

export async function getTutorialIds() {
  const tutorialIds = await getPackages(process.cwd()).then(({ root, packages }) => {
    return packages
      .filter(pkg => pkg.dir.includes(path.resolve(root.dir, 'tutorials')))
      .map(pkg => path.resolve('/tutorials', pkg.packageJson.name));
  });

  return tutorialIds;
}
