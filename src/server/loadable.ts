import NodeFS from "node:fs/promises";
import path from "path";
import { ChunkExtractor } from "@loadable/server";

async function loadStats(filepath: string) {
	const stats = JSON.parse(await NodeFS.readFile(filepath, "utf-8"));
	if (stats.namedChunkGroups) {
		for (const key in stats.namedChunkGroups) {
			if (stats.namedChunkGroups.hasOwnProperty(key)) {
				const item = stats.namedChunkGroups[key];
				item.childAssets = item.childAssets || {};
			}
		}
	}
	return stats;
}
export default async () => {
	const statsFile = path.resolve(process.cwd(), "public/loadable-stats.json");
	const extractor = new ChunkExtractor({
		stats: await loadStats(statsFile)
	});
	return extractor;
};
