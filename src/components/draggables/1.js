function solveMine(map, n) {
	const arr = map
		.split("\n")
		.map((v) => v.split(" ").map((v) => (v === "?" ? undefined : +v)));
	const open = (r, c) => {
		return [
			["1", "x", "1", "1", "x", "1"],
			["2", "2", "2", "1", "2", "2"],
			["2", "x", "2", "0", "1", "x"],
			["2", "x", "2", "1", "2", "2"],
			["1", "1", "1", "1", "x", "1"],
			["0", "0", "0", "1", "1", "1"],
		][r][c];
	};
	const openAround = (r, c) => {
		if (arr[r][c] !== 0) return;
		const queue = [[r, c]];
		while (queue.length) {
			const [r, c] = queue.shift();
			for (const dy of [-1, 0, 1]) {
				for (const dx of [-1, 0, 1]) {
          if (dy === 0 && dx ===0) continue;
					const y = r + dy;
          if (y < 0 || y >= n) continue;
					const x = c + dx;
          if (x < 0 || x >= n) continue;
          if (arr[y][x] === undefined) {
            arr[y][x] = open(y, x);
            if (+arr[y][x] === 0) queue.push([y, x]);
          }
				}
			}
		}
	};
	const openAroundZeroes = () => {
		for (let i = 0; i < n; i++) {
			for (let j = 0; j < n; j++) {
				if (arr[i][j] === 0) openAround(i, j);
			}
		}
	};
	openAroundZeroes();
	return arr;
}
