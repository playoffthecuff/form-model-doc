function solveMine(map, n) {
	const arr = map
	.split("\n")
	.map((v) => v.split(" ").map((v) => (v === "?" ? undefined : +v)));
	let zeroesQueue = [];
	let numbersQueue = [];
	const range = [-1, 0, 1];
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < n; j++) {
			if (arr[i][j] === 0) zeroesQueue.push([i, j]);
		}
	}
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
	const openAroundZero = (el) => {
		const [r, c] = el;
		if (arr[r][c] !== 0) return;
		const queue = [el];
		while (queue.length) {
			const [r, c] = queue.shift();
			for (const dy of range) {
				for (const dx of range) {
					if (dy === 0 && dx === 0) continue;
					const y = r + dy;
					if (y < 0 || y >= n) continue;
					const x = c + dx;
					if (x < 0 || x >= n) continue;
					if (arr[y][x] === undefined) {
						arr[y][x] = +open(y, x);
						if (arr[y][x] === 0) queue.push([y, x]);
						if (typeof arr[y][x] === "number") numbersQueue.push([y, x]);
					}
				}
			}
		}
	};
	const openAroundZeroes = () => {
		for (const el of zeroesQueue) {
			const [r, c] = el;
			if (arr[r][c] === 0) {
				openAroundZero(el);
			}
		}
	};
	openAroundZeroes();
	const markMineAroundNumber = (el) => {
		const [r, c] = el;
		let v = arr[r][c];
		if (v < 1) return;
		const queue = [];
		for (const dy of range) {
			for (const dx of range) {
				if (dy === 0 && dx === 0) continue;
				const y = r + dy;
				if (y < 0 || y >= n) continue;
				const x = c + dx;
				if (x < 0 || x >= n) continue;
				if (arr[y][x] === undefined) {
					queue.push([y, x]);
					v--;
				}
				if (arr[y][x] === "x") v--;
			}
		}
		if (v === 0) {
			for (const cell of queue) {
				const [r, c] = cell;
				arr[r][c] = "x";
			}
			numbersQueue = numbersQueue.filter((v) => v !== el);
		}
	};
	const openAroundNumber = (el) => {
		const [r, c] = el;
		let v = arr[r][c];
		if (typeof v !== "number") return;
		// счетчик значение клетки. считаем кол-во мин в окрестности убавляя счетчик,
		// андефайнды вносим в очередь. если счетчик нуль (марок мин столько сколько в числе),
		// то рекурсивно открываем андефайнды
		const queue = [[r, c]];
		while (queue.length) {
			const [r, c] = queue.shift();
			v = arr[r][c];
			const undefineds = [];
			for (const dy of range) {
				for (const dx of range) {
					if (dy === 0 && dx === 0) continue;
					const y = r + dy;
					if (y < 0 || y >= n) continue;
					const x = c +  dx;
					if (x < 0 || x >= n) continue;
					if (arr[y][x] === undefined) undefineds.push([y, x]);
					if (arr[y][x] === 'x') v--;
				}
			}
			if (v === 0) {
				numbersQueue = numbersQueue.filter(([cy, cx]) => cy !== r || cx !== c);
				for (const [r, c] of undefineds) {
					arr[r][c] = open(r, c) === 'x' ? 'x' : +open(r, c);
					if (typeof arr[r][c] === "number") {
						queue.push([r, c]);
						numbersQueue.push([r, c]);
					}
				}
			}
		}
	};
	for (const cell of numbersQueue) {
		markMineAroundNumber(cell);
	}
	for (const cell of numbersQueue) {
		openAroundNumber(cell); // добавить маркировку мин вокруг новых открытых чисел
	}
	for (const cell of numbersQueue) {
		markMineAroundNumber(cell); // убрать повторения
	}
	for (const cell of numbersQueue) {
		openAroundNumber(cell); // убрать повторения
	}
	const openImpossibles = () => {
		// идём по числам
		// помечаем андефайнды ТОЛЬКО в которых могут быть мины для окрестных чисел
		// то есть у окрестного числа нет необщих андефайндов
		// если остаётся непомеченый андефайнд и для числа не помечена 1 мина,
		// то её точно нет в этом андефайнде и его можно открыть
	}
	console.log(numbersQueue);
	return arr;
}

// biome-ignore lint/style/noVar: <explanation>
// biome-ignore lint/style/useSingleVarDeclarator: <explanation>
var map = `? ? ? ? ? ?
? ? ? ? ? ?
? ? ? 0 ? ?
? ? ? ? ? ?
? ? ? ? ? ?
0 0 0 ? ? ?`,
	result = `1 x 1 1 x 1
2 2 2 1 2 2
2 x 2 0 1 x
2 x 2 1 2 2
1 1 1 1 x 1
0 0 0 1 1 1`;

console.log(
	"🚀 ~ solveMine:",
	solveMine(map, 6).map((v) =>
		v.map((v) => (v === undefined ? "z" : String(v))),
	),
);
