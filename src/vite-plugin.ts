// import { createFilter } from '@rollup/pluginutils';

// import { collectStyles, replaceStyleTemplates } from './utils/loaders';

// function astroturf({ include, exclude, ...rest } = {}) {
//   const filter = createFilter(include || /\.(jsx?|tsx?)/i, exclude);
//   const cssLookup = new Map();
//   const pathMap = new Map();
//   const sourceMetadata = new Map();

//   function transform(content, filename) {
//     const metadata = collectStyles(content, filename, undefined, rest);

//     const { code, map } = replaceStyleTemplates(
//       filename,
//       content,
//       metadata.changeset,
//       true,
//     );

//     sourceMetadata.set(filename, metadata);

//     metadata.styles.forEach(({ absoluteFilePath, requirePath, value }) => {
//       cssLookup.set(absoluteFilePath, value);
//       pathMap.set(requirePath, absoluteFilePath);
//     });

//     return {
//       code,
//       map,
//       styles: metadata.styles,
//     };
//   }

//   return {
//     name: 'astroturf',

//     load(id) {
//       return cssLookup.get(id) || cssLookup.get(process.cwd() + id);
//     },

//     resolveId(importee) {
//       importee = importee.split('?')[0];
//       const id = cssLookup.get(importee) || pathMap.get(importee);
//       return id;
//     },

//     async handleHotUpdate(hmr) {
//       if (!filter(hmr.file)) return undefined;

//       // console.log("ff", hmr, hmr.modules);
//       const prev = sourceMetadata.get(hmr.file);

//       if (!prev) return undefined;

//       const module = hmr.modules.find((m) => m.file === hmr.file);
//       const affectedModules = new Set(hmr.modules);

//       const content = await hmr.read();
//       const { styles } = transform(content, hmr.file);

//       try {
//         module.importedModules?.forEach((m) => {
//           if (
//             styles.find(
//               (s) =>
//                 s.absoluteFilePath === m.file ||
//                 s.absoluteFilePath === process.cwd() + m.file,
//             )
//           ) {
//             affectedModules.add(m);
//           }
//         });
//       } catch (err) {
//         console.log(err);
//       }

//       return [...affectedModules];
//     },

//     transform(content, id) {
//       if (!filter(id) || !content.includes('astroturf')) {
//         return undefined;
//       }

//       const { code, map } = transform(content, id);

//       return { code, map };
//     },
//   };
// }

// export default astroturf;
