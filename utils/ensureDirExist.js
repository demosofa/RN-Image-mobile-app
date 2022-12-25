import * as FileSystem from "expo-file-system";
export default async function ensureDirExist(linkDir, isNew = false) {
  const dirInfo = await FileSystem.getInfoAsync(linkDir);
  if (dirInfo.exists) return true;
  if (isNew)
    await FileSystem.makeDirectoryAsync(linkDir, {
      intermediates: true,
    });
  return false;
}
