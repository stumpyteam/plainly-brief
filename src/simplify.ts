export type Level = "plain" | "context" | "points";

export type Stats = {
  grade: number | null;
  words: number;
  sentences: number;
};

const LEVEL_RANK: Record<Level, number> = {
  context: 0,
  plain: 1,
  points: 1,
};

const MAX_WORDS: Record<Level, number> = {
  context: 24,
  plain: 16,
  points: 18,
};

/** rank: 0 easy+, 1 plain+, 2 very easy only. Longer phrases are applied first. */
const SWAPS: Array<[string, string, number]> = [
  ["in order to facilitate a comprehensive understanding of", "to understand", 0],
  ["facilitate a comprehensive understanding of", "explain", 0],
  ["prior to the implementation of any substantive modifications", "before any real changes", 0],
  ["prior to the implementation of", "before", 0],
  ["the implementation of", "", 0],
  ["prior to implementation", "before using it", 0],
  ["their compliance obligations", "the rules they must follow", 0],
  ["provide assistance to", "help", 0],
  ["the initiative is intended to", "the plan is meant to", 1],
  ["is intended to", "is meant to", 0],
  ["must do a careful review of", "should check", 2],
  ["run into real trouble when trying to find out", "struggle to learn", 2],
  ["more opportunities to lower", "more ways to cut", 2],
  ["more opportunities to reduce", "more ways to cut", 2],
  ["conducted an analysis", "did a review", 0],
  ["more efficiently", "better", 1],
  ["further studies", "more studies", 1],
  ["clinical settings", "clinics", 2],
  ["the traditional approach", "the usual way", 2],
  ["it is important to note that", "", 0],
  ["it is worth noting that", "", 0],
  ["it should be noted that", "", 0],
  ["please be advised that", "", 0],
  ["as a matter of fact", "", 0],
  ["in light of the fact that", "because", 0],
  ["owing to the fact that", "because", 0],
  ["due to the fact that", "because", 0],
  ["despite the fact that", "although", 0],
  ["in spite of the fact that", "although", 0],
  ["a significant number of", "many", 0],
  ["a large number of", "many", 0],
  ["a wide range of", "many", 0],
  ["a multitude of", "many", 0],
  ["at this point in time", "now", 0],
  ["at the present time", "now", 0],
  ["in the near future", "soon", 0],
  ["in the event that", "if", 0],
  ["for the purpose of", "to", 0],
  ["in an effort to", "to", 0],
  ["in order to", "to", 0],
  ["in order for", "so", 0],
  ["so as to", "to", 0],
  ["has the ability to", "can", 0],
  ["have the ability to", "can", 0],
  ["is able to", "can", 0],
  ["are able to", "can", 0],
  ["with regard to", "about", 0],
  ["with respect to", "about", 0],
  ["in regard to", "about", 0],
  ["in relation to", "about", 0],
  ["in accordance with", "under", 0],
  ["with the exception of", "except", 0],
  ["in close proximity to", "near", 0],
  ["in the vicinity of", "near", 0],
  ["take into consideration", "consider", 0],
  ["give consideration to", "consider", 0],
  ["conduct an investigation", "investigate", 0],
  ["provide assistance", "help", 0],
  ["make a decision", "decide", 0],
  ["make an attempt", "try", 0],
  ["is indicative of", "shows", 0],
  ["in excess of", "more than", 0],
  ["a sufficient amount of", "enough", 0],
  ["in the absence of", "without", 0],
  ["on a daily basis", "daily", 0],
  ["on a regular basis", "regularly", 0],
  ["compliance obligations", "rules they must follow", 0],
  ["may be subject to", "may face", 0],
  ["fails to adhere to", "does not follow", 0],
  ["fail to adhere to", "do not follow", 0],
  ["adhere to", "follow", 0],
  ["prescribed requirements", "set rules", 0],
  ["substantial penalties", "large fines", 0],
  ["potential ramifications", "possible effects", 0],
  ["thorough evaluation", "careful review", 0],
  ["significant difficulties", "real trouble", 0],
  ["interrelated provisions", "linked rules", 0],
  ["the aforementioned", "this", 0],
  ["aforementioned", "this", 0],
  ["prior to", "before", 0],
  ["subsequent to", "after", 0],
  ["whether or not", "whether", 0],
  ["the fact that", "that", 1],
  ["due to", "because of", 0],
  ["in terms of", "for", 1],
  ["pursuant to", "under", 0],
  ["as well as", "and", 0],
  ["in addition", "also", 0],
  ["on the other hand", "but", 0],
  ["a majority of", "most", 0],
  ["the majority of", "most", 0],
  ["each and every", "every", 0],
  ["first and foremost", "first", 0],
  ["end result", "result", 0],
  ["basic fundamentals", "basics", 0],
  ["at all times", "always", 0],
  ["in many cases", "often", 0],
  ["in most cases", "usually", 0],
  ["in some cases", "sometimes", 0],
  ["notwithstanding", "despite", 1],
  ["stakeholders", "the people involved", 0],
  ["ramifications", "effects", 0],
  ["implementation", "use", 1],
  ["modifications", "changes", 0],
  ["modification", "change", 0],
  ["legislation", "law", 0],
  ["encompasses", "covers", 0],
  ["encompass", "cover", 0],
  ["interrelated", "linked", 0],
  ["provisions", "rules", 0],
  ["provision", "rule", 0],
  ["frequently", "often", 0],
  ["encounter", "run into", 0],
  ["encounters", "runs into", 0],
  ["significant", "large", 0],
  ["attempting", "trying", 0],
  ["ascertain", "find out", 0],
  ["obligations", "duties", 0],
  ["obligation", "duty", 0],
  ["furthermore", "also", 0],
  ["moreover", "also", 0],
  ["additionally", "also", 0],
  ["consequently", "so", 0],
  ["therefore", "so", 0],
  ["however", "but", 0],
  ["nevertheless", "still", 1],
  ["individuals", "people", 0],
  ["individual", "person", 1],
  ["organizations", "groups", 0],
  ["organization", "group", 0],
  ["approximately", "about", 0],
  ["demonstrate", "show", 0],
  ["demonstrates", "shows", 0],
  ["additional", "more", 0],
  ["currently", "now", 0],
  ["obtain", "get", 0],
  ["obtains", "gets", 0],
  ["require", "need", 0],
  ["requires", "needs", 0],
  ["required", "needed", 0],
  ["provide", "give", 0],
  ["provides", "gives", 0],
  ["regarding", "about", 0],
  ["numerous", "many", 0],
  ["sufficient", "enough", 0],
  ["purchase", "buy", 0],
  ["assist", "help", 0],
  ["assistance", "help", 0],
  ["commence", "start", 0],
  ["terminate", "end", 0],
  ["indicate", "show", 0],
  ["indicates", "shows", 0],
  ["initial", "first", 0],
  ["opportunity", "chance", 0],
  ["participate", "take part", 0],
  ["previous", "earlier", 0],
  ["previously", "before", 0],
  ["primary", "main", 0],
  ["request", "ask", 0],
  ["respond", "answer", 0],
  ["response", "answer", 1],
  ["select", "choose", 0],
  ["utilize", "use", 0],
  ["utilise", "use", 0],
  ["utilization", "use", 0],
  ["facilitate", "help", 0],
  ["facilitates", "helps", 0],
  ["comprehensive", "full", 0],
  ["undertake", "do", 0],
  ["undertakes", "does", 0],
  ["thorough", "careful", 0],
  ["evaluation", "review", 0],
  ["potential", "possible", 0],
  ["substantive", "real", 0],
  ["penalties", "fines", 0],
  ["penalty", "fine", 0],
  ["entity", "group", 1],
  ["entities", "groups", 1],
  ["regulatory", "rule", 1],
  ["framework", "system", 1],
  ["component", "part", 1],
  ["components", "parts", 1],
  ["objective", "goal", 1],
  ["objectives", "goals", 1],
  ["strategy", "plan", 1],
  ["strategies", "plans", 1],
  ["implement", "start", 1],
  ["implemented", "started", 1],
  ["analysis", "review", 1],
  ["analyze", "review", 1],
  ["analyse", "review", 1],
  ["beneficial", "helpful", 1],
  ["challenging", "hard", 1],
  ["complicated", "hard", 1],
  ["complex", "hard", 2],
  ["concept", "idea", 1],
  ["concepts", "ideas", 1],
  ["considerable", "large", 1],
  ["construct", "build", 1],
  ["determine", "find", 1],
  ["determines", "finds", 1],
  ["efficient", "fast", 2],
  ["establish", "set up", 1],
  ["established", "set up", 1],
  ["evaluate", "review", 1],
  ["evidence", "proof", 1],
  ["examine", "look at", 1],
  ["factor", "part", 2],
  ["factors", "parts", 2],
  ["generate", "make", 1],
  ["identify", "find", 1],
  ["identified", "found", 1],
  ["impact", "effect", 1],
  ["increase", "raise", 1],
  ["inform", "tell", 1],
  ["maintain", "keep", 1],
  ["method", "way", 1],
  ["methods", "ways", 1],
  ["necessary", "needed", 1],
  ["occur", "happen", 1],
  ["occurs", "happens", 1],
  ["occurred", "happened", 1],
  ["option", "choice", 1],
  ["options", "choices", 1],
  ["perform", "do", 1],
  ["prevent", "stop", 1],
  ["reduce", "lower", 1],
  ["relevant", "related", 1],
  ["structure", "shape", 2],
  ["traditional", "usual", 2],
  ["information", "facts", 2],
  ["difficulties", "trouble", 0],
  ["difficulty", "trouble", 0],
  ["subsequently", "later", 0],
  ["numerous", "many", 0],
  ["make an attempt", "try", 0],
  ["remain", "stay", 1],
  ["remains", "stays", 1],
  ["ensure", "make sure", 1],
  ["ensures", "makes sure", 1],
  ["multiple", "many", 1],
  ["various", "many", 1],
  ["regarding the", "about the", 0],
  ["what they describe as", "", 0],
  ["in recent weeks", "", 0],
  ["a number of", "some", 0],
  ["Prime Minister Mark Carney", "Prime Minister Carney", 0],
  ["insisted that", "said", 1],
  ["suggested that", "said", 0],
  ["ahead of their", "before the", 1],
  ["brushing off concerns about", "downplaying", 1],
  ["is not getting involved in", "will stay out of", 2],
  ["possible interference", "meddling", 2],
  ["the American midterms", "the U.S. election", 2],
  ["midterm elections", "midterms", 1],
  ["the federal government", "the government", 1],
  ["to summarize", "", 0],
  ["in summary", "", 0],
];

function escapeReg(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyCase(source: string, replacement: string): string {
  if (!replacement) return "";
  const letters = source.replace(/[^A-Za-z]+/g, "");
  if (letters.length > 1 && letters === letters.toUpperCase()) {
    return replacement.toUpperCase();
  }
  const first = source.trim().charAt(0);
  if (first && first === first.toUpperCase() && first !== first.toLowerCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

function polish(value: string): string {
  let out = value;
  out = out.replace(/\b([Tt]ake)\s+((?:[\w']+\s+){1,8}?)into consideration\b/g, (_, verb: string, mid: string) => {
    const next = verb[0] === "T" ? "Consider" : "consider";
    return `${next} ${mid.trim()}`;
  });
  out = out.replace(/(\d),\s+(?=\d{3}\b)/g, "$1,");
  out = out.replace(/\bBut,\s+/g, "But ");
  out = out.replace(/\bSo,\s+/g, "So ");
  out = out.replace(/\btheir the\b/gi, "the");
  out = out.replace(/\bhelp to\b/gi, "help");
  out = out.replace(/\bto to\b/gi, "to");
  out = out.replace(/\ba a\b/gi, "a");
  out = out.replace(/\bof of\b/gi, "of");
  out = out.replace(/\bbefore the use of\b/gi, "before");
  out = out.replace(/\ban (?=[bcdfghjklmnpqrstvwxyz])/gi, (match) => (match[0] === "A" ? "A " : "a "));
  return tidy(out);
}

function tidy(value: string): string {
  return value
    .replace(/\s+([,.;!?])/g, "$1")
    .replace(/,\s*,/g, ",")
    .replace(/\s{2,}/g, " ")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .replace(/^[,;:\s]+/, "")
    .replace(/\s+$/, "")
    .trim();
}

function capitalize(value: string): string {
  return value.replace(/^([^A-Za-z]*)([a-z])/, (_, lead: string, ch: string) => lead + ch.toUpperCase());
}

function swapWords(input: string, level: Level): string {
  const rank = LEVEL_RANK[level];
  const pairs = SWAPS.filter((entry) => entry[2] <= rank).sort((a, b) => b[0].length - a[0].length);
  let out = input;
  for (let pass = 0; pass < 3; pass += 1) {
    const before = out;
    for (const [from, to] of pairs) {
      const re = new RegExp(`\\b${escapeReg(from)}\\b`, "gi");
      out = out.replace(re, (match) => applyCase(match, to));
    }
    out = tidy(out);
    if (out === before) break;
  }
  return out;
}

function wordsOf(value: string): string[] {
  return value.trim().split(/\s+/).filter((word) => /[A-Za-z0-9]/.test(word));
}

function protectAbbreviations(value: string): string {
  return value.replace(/\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|Sen|Rep|Gov|Gen|St|vs|etc|e\.g|i\.e|U\.S|U\.K|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\./gi, (match) =>
    match.replace(/\./g, "∯"),
  );
}

function restoreAbbreviations(value: string): string {
  return value.replace(/∯/g, ".");
}

function splitSentences(value: string): string[] {
  const guarded = protectAbbreviations(value);
  const parts: string[] = [];
  let current = "";
  let quote: '"' | "“" | "" = "";
  for (let i = 0; i < guarded.length; i += 1) {
    const ch = guarded[i];
    current += ch;
    if (!quote && (ch === '"' || ch === "“")) quote = ch === "“" ? "“" : '"';
    else if (quote === '"' && ch === '"') quote = "";
    else if (quote === "“" && ch === "”") quote = "";
    if (quote || !/[.!?]/.test(ch)) continue;
    const next = guarded.slice(i + 1);
    if (/^\s+[A-Z“"(\[]/.test(next) || next.trim() === "") {
      const gap = next.match(/^\s*/)?.[0].length ?? 0;
      const sentence = restoreAbbreviations(current).trim();
      if (sentence) parts.push(sentence);
      current = "";
      i += gap;
    }
  }
  const tail = restoreAbbreviations(current).trim();
  if (tail) parts.push(tail);
  return parts.filter(Boolean);
}

function finishSentence(value: string): string {
  const clean = tidy(value);
  if (!clean) return "";
  const capped = capitalize(clean);
  if (/[.!?]$/.test(capped) || /[.!?]"$/.test(capped)) return capped;
  return `${capped}.`;
}

type Split = { left: string; right: string };

function isSafeSplit(left: string, right: string): boolean {
  if (/^(?:to|if|because|when|although|while|after|before)\b/i.test(left)) return false;
  if (/^(?:also,?\s+)?(?:if|because|when|although)\b/i.test(left)) return false;
  if (/\b(?:if|when|although)\b/i.test(left) && /^(?:it|they|this|that|these|those|he|she|we)\b/i.test(right)) {
    return false;
  }
  return true;
}

function findSplit(sentence: string, level: Level): Split | null {
  const body = sentence.replace(/[.!?]+$/, "").trim();
  const patterns: Array<{ re: RegExp; prefix: string }> = [
    { re: /;\s+/i, prefix: "" },
    { re: /,\s+however,?\s+/i, prefix: "But " },
    { re: /,\s+therefore,?\s+/i, prefix: "So " },
    { re: /,\s+(?:furthermore|moreover|additionally|consequently),?\s+/i, prefix: "Also " },
    { re: /,\s+but\s+/i, prefix: "But " },
    { re: /,\s+which\s+/i, prefix: "This " },
    { re: /,\s+while\s+/i, prefix: "" },
    { re: /,\s+and\s+/i, prefix: "" },
  ];

  if (level !== "context") {
    patterns.push({
      re: /,\s+(?=(?:the|a|an|people|groups|they|this|it|we|you|officials|researchers|residents|scientists|many)\b)/i,
      prefix: "",
    });
    patterns.push({ re: /\s+because\s+/i, prefix: "This is because " });
  }

  const total = wordsOf(body).length;
  let best: { score: number; left: string; right: string } | null = null;

  for (const pattern of patterns) {
    const flags = pattern.re.flags.includes("g") ? pattern.re.flags : `${pattern.re.flags}g`;
    const re = new RegExp(pattern.re.source, flags);
    for (const match of body.matchAll(re)) {
      const index = match.index ?? -1;
      if (index < 0) continue;
      const left = body.slice(0, index).trim();
      let right = body.slice(index + match[0].length).trim();
      if (wordsOf(left).length < 4 || wordsOf(right).length < 4) continue;
      if (!isSafeSplit(left, right)) continue;
      if (pattern.prefix && !right.toLowerCase().startsWith(pattern.prefix.trim().toLowerCase())) {
        right = pattern.prefix + right.charAt(0).toLowerCase() + right.slice(1);
      }
      const balance = Math.abs(wordsOf(left).length - total / 2);
      const score = balance + (pattern.prefix ? 0 : 1);
      if (!best || score < best.score) best = { score, left, right };
    }
  }

  return best ? { left: best.left, right: best.right } : null;
}

function breakSentence(sentence: string, level: Level, depth = 0): string[] {
  const max = MAX_WORDS[level];
  const current = tidy(sentence);
  if (!current) return [];
  if (wordsOf(current).length <= max || depth > 4) return [finishSentence(current)];

  const split = findSplit(current, level);
  if (!split) return [finishSentence(current)];

  if (level === "context" && wordsOf(current).length < max + 8 && !/[;]/.test(current)) {
    return [finishSentence(current)];
  }

  return [...breakSentence(split.left, level, depth + 1), ...breakSentence(split.right, level, depth + 1)];
}

function simplifyProse(value: string, level: Level): string {
  const sentences = splitSentences(value.replace(/\s*\n\s*/g, " "));
  if (level === "context") {
    const rewritten = sentences.flatMap((sentence) => breakSentence(swapWords(sentence, level), level));
    return polish(rewritten.join(" "));
  }
  return polish(sentences.map((sentence) => compressSentence(sentence, level)).join(" "));
}

function isListBlock(block: string): boolean {
  const lines = block
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) return false;
  const listed = lines.filter((line) => /^(?:[-*•]|\d+[.)])\s+/.test(line)).length;
  return listed >= Math.ceil(lines.length * 0.6);
}

function simplifyBlock(block: string, level: Level): string {
  if (isListBlock(block)) {
    return block
      .split(/\n/)
      .map((line) => {
        const match = line.match(/^(\s*(?:[-*•]|\d+[.)])\s+)(.*)$/);
        if (!match) return simplifyProse(line, level);
        const body = match[2].trim();
        if (!body) return line;
        return `${match[1]}${simplifyProse(body, level)}`;
      })
      .join("\n");
  }
  return simplifyProse(block, level);
}

const SUMMARY_BUDGET: Record<
  Level,
  { ratio: number; minWords: number; maxWords: number; minSentences: number; maxSentences: number }
> = {
  context: { ratio: 0.28, minWords: 110, maxWords: 190, minSentences: 5, maxSentences: 6 },
  plain: { ratio: 0.1, minWords: 40, maxWords: 75, minSentences: 2, maxSentences: 3 },
  points: { ratio: 0.14, minWords: 50, maxWords: 100, minSentences: 4, maxSentences: 5 },
};

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "of", "to", "in", "on", "for", "with", "that", "this",
  "is", "are", "was", "were", "be", "as", "by", "from", "at", "it", "its", "their", "his", "her",
  "they", "he", "she", "said", "says", "after", "about", "have", "has", "had", "not", "who",
]);

function contentWords(sentence: string): string[] {
  return wordsOf(sentence)
    .map((word) => word.toLowerCase().replace(/[^a-z0-9]/g, ""))
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

function overlap(left: string, right: string): number {
  const a = new Set(contentWords(left));
  const b = new Set(contentWords(right));
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  a.forEach((word) => {
    if (b.has(word)) shared += 1;
  });
  return shared / Math.min(a.size, b.size);
}

function scoreSentence(sentence: string, index: number): number {
  const words = wordsOf(sentence);
  if (words.length < 7) return -5;
  let score = 0;
  if (index === 0) score += 14;
  else if (index === 1) score += 8;
  else if (index < 4) score += 4;
  if (words.length >= 10 && words.length <= 32) score += 3;
  if (words.length > 42) score -= 2;
  if (/\d/.test(sentence)) score += 2;
  const names = words.filter((word) => /^[A-Z][a-z]{2,}/.test(word) && !/^(Both|They|This|That)$/.test(word)).length;
  score += Math.min(names, 3);
  if (index > 0 && /^(both|they|he|she|it)\b/i.test(sentence) && names === 0) score -= 8;
  if (/[“"]/.test(sentence) && words.length > 24) score -= 1;
  if (/\b(said|says|told)\b/i.test(sentence) && words.length < 16) score -= 4;
  return score;
}

function trimAttribution(sentence: string): string {
  const withoutLead = sentence.replace(/^(?:according to (?:the )?(?:release|embassy|report|officials),?\s+)/i, "");
  const leadRemoved =
    withoutLead !== sentence && /^(while|although|if|when|because|which|that|after|before)\b/i.test(withoutLead)
      ? sentence
      : withoutLead;
  const out = leadRemoved.replace(
    /,\s+(?:(?:[A-Z][\w.’'-]*|the|a|an|his|her|their)\s+){0,6}(?:said|says|told reporters|told Global News|said in the ad)\b[^.!?]*$/i,
    "",
  );
  return tidy(out);
}

function splitClauses(sentence: string): string[] {
  const body = sentence.replace(/[.!?]+["”']?$/, "").trim();
  const parts: string[] = [];
  let current = "";
  let quote = false;
  for (const ch of body) {
    if (ch === '"' || ch === "“" || ch === "”") quote = !quote;
    if (!quote && (ch === "," || ch === ";" || ch === "—")) {
      if (current.trim()) parts.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.trim()) parts.push(current.trim());
  return parts.length ? parts : [body];
}

function cutAt(sentence: string, pattern: RegExp, minWords: number): string {
  const parts = sentence.split(pattern);
  if (parts.length > 1 && wordsOf(parts[0]).length >= minWords) return parts[0].trim();
  return sentence;
}

function isStub(value: string): boolean {
  const text = value.replace(/[.!?]+$/, "").trim();
  if (wordsOf(text).length < 5) return true;
  if (/^(also|and|but|or|whether)\b/i.test(text) && wordsOf(text).length < 12) return true;
  if (/^(if|because|while|although|when)\b/i.test(text) && !/,/.test(text)) return true;
  return false;
}

function compressSentence(sentence: string, level: Level): string {
  let text = swapWords(trimAttribution(sentence), level).replace(/\s{2,}/g, " ").trim();
  const full = text;
  if (level === "context") {
    return polish(finishSentence(text.replace(/\s*[–—-]+\s*$/, "")));
  }
  if (level === "points") {
    text = text.replace(/[“”"]/g, "");
    text = cutAt(text, /\s+including\s+/i, 8);
    const clauses = splitClauses(text).filter((clause) => !/^(while|although|if|when|according)\b/i.test(clause));
    text = clauses.slice(0, 2).join(", ") || full;
    if (isStub(text) || wordsOf(text).length < 6) text = full;
    return polish(finishSentence(text));
  }
  text = text.replace(/[“”"]/g, "");
  text = cutAt(text, /\s+after\s+/i, 8);
  text = cutAt(text, /\s+including\s+/i, 8);
  const limit = 24;
  let clauses = splitClauses(text);
  while (clauses.length > 1 && wordsOf(clauses.join(" ")).length > limit) {
    const next = clauses.slice(0, -1);
    const trial = next.join(", ");
    if (wordsOf(trial).length < 8 || isStub(trial) || /^(if|when|although|while|because)\b/i.test(next[next.length - 1] || "")) {
      break;
    }
    clauses = next;
  }
  text = clauses.join(", ");
  text = text.replace(/\s*[–—-]+\s*$/, "").replace(/\s+(?:and|or|but|including)\s*$/i, "");
  if (isStub(text) || wordsOf(text).length < 6) text = full;
  return polish(finishSentence(text));
}

function simplifyKept(sentence: string, level: Level): string {
  return compressSentence(sentence, level);
}

function summarize(text: string, level: Level): string | null {
  const flat = text.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
  const sentences = splitSentences(flat);
  const wordCount = wordsOf(flat).length;
  if (sentences.length < 6 && wordCount < 180) return null;

  const budget = SUMMARY_BUDGET[level];
  const target = Math.max(budget.minWords, Math.min(budget.maxWords, Math.round(wordCount * budget.ratio)));
  const ranked = sentences
    .map((sentence, index) => ({ sentence, index, score: scoreSentence(sentence, index) }))
    .filter((item) => item.score > 0);
  if (ranked.length === 0) return null;

  const chosen: Array<{ sentence: string; index: number }> = [];
  const chosenWordCount = () => chosen.reduce((sum, item) => sum + wordsOf(item.sentence).length, 0);
  const tooClose = (sentence: string) => chosen.some((kept) => overlap(kept.sentence, sentence) > 0.42);

  if (level === "plain") {
    const lede = ranked.find((item) => item.index === 0) ?? ranked[0];
    chosen.push(lede);
    const rest = ranked
      .filter((item) => item.index !== lede.index)
      .sort((a, b) => b.score - a.score || a.index - b.index);
    for (const item of rest) {
      if (chosen.length >= budget.maxSentences) break;
      if (chosenWordCount() >= target && chosen.length >= budget.minSentences) break;
      if (tooClose(item.sentence)) continue;
      const nextWords = chosenWordCount() + wordsOf(item.sentence).length;
      if (nextWords > budget.maxWords && chosen.length >= budget.minSentences) continue;
      chosen.push(item);
    }
  } else {
    const slices = level === "points" ? 4 : 3;
    for (let slice = 0; slice < slices; slice += 1) {
      const start = Math.floor((slice * sentences.length) / slices);
      const end = Math.floor(((slice + 1) * sentences.length) / slices);
      const best = ranked
        .filter((item) => item.index >= start && item.index < end && !tooClose(item.sentence))
        .sort((a, b) => b.score - a.score || a.index - b.index)[0];
      if (best) chosen.push(best);
    }
    const rest = ranked
      .filter((item) => !chosen.some((kept) => kept.index === item.index))
      .sort((a, b) => b.score - a.score || a.index - b.index);
    for (const item of rest) {
      if (chosen.length >= budget.maxSentences) break;
      if (level === "points") break;
      if (chosenWordCount() >= target && chosen.length >= budget.minSentences) break;
      if (tooClose(item.sentence)) continue;
      if (chosenWordCount() + wordsOf(item.sentence).length > budget.maxWords && chosen.length >= budget.minSentences) {
        continue;
      }
      chosen.push(item);
    }
  }

  const simplified = chosen
    .sort((a, b) => a.index - b.index)
    .map((item) => simplifyKept(item.sentence, level))
    .filter(Boolean);
  if (simplified.length === 0) return null;
  if (level === "points") return simplified.map((sentence) => `• ${sentence}`).join("\n\n");
  if (simplified.length <= 2) return simplified.join(" ");
  const mid = Math.max(1, Math.ceil(simplified.length / 2));
  return `${simplified.slice(0, mid).join(" ")}\n\n${simplified.slice(mid).join(" ")}`;
}

export function simplify(text: string, level: Level): string {
  const cleaned = text.replace(/\r\n/g, "\n").trim();
  if (!cleaned) return "";
  if (!isListBlock(cleaned)) {
    const summary = summarize(cleaned, level);
    if (summary) return summary;
  }
  return cleaned
    .split(/\n{2,}/)
    .map((block) => simplifyBlock(block.trim(), level))
    .filter(Boolean)
    .join("\n\n");
}

function syllables(word: string): number {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!cleaned) return 0;
  if (cleaned.length <= 3) return 1;
  const trimmed = cleaned.replace(/e$/, "");
  const groups = trimmed.match(/[aeiouy]+/g);
  return Math.max(1, groups?.length ?? 1);
}

export function analyze(text: string): Stats {
  const trimmed = text.trim();
  if (!trimmed) return { grade: null, words: 0, sentences: 0 };
  const sentences = Math.max(1, splitSentences(trimmed).length);
  const words = wordsOf(trimmed);
  if (words.length === 0) return { grade: null, words: 0, sentences: 0 };
  const syllableCount = words.reduce((sum, word) => sum + syllables(word), 0);
  const grade = 0.39 * (words.length / sentences) + 11.8 * (syllableCount / words.length) - 15.59;
  return {
    grade: Math.round(grade * 10) / 10,
    words: words.length,
    sentences: splitSentences(trimmed).length,
  };
}

export function gradeLabel(grade: number | null): string {
  if (grade === null) return "—";
  const rounded = Math.min(18, Math.max(1, Math.round(grade)));
  return `Grade ${rounded}`;
}
