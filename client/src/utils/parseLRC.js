export function parseLRC(lrcText) {
    if (!lrcText) return [];

    const lines = lrcText.split('\n');
    const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
    const parsed = [];

    lines.forEach(line => {
        const match = timeRegex.exec(line);
        if (match) {
            const minutes = parseInt(match[1], 10);
            const seconds = parseInt(match[2], 10);
            const milliseconds = parseInt(match[3].padEnd(3, '0'), 10);

            const total = minutes * 60 + seconds + milliseconds / 1000;
            const text = line.replace(timeRegex, "").trim();
            parsed.push({
                time: total, text: text
            });
        }
    });

    return parsed.sort((a, b) => a.time - b.time);
}