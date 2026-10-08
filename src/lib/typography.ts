// Keep short Russian conjunctions and prepositions with the following word.
// Only ordinary spaces are replaced: paragraphs and deliberate line breaks stay intact.
const shortWords = /(?<![\p{L}\p{N}])(?:в|во|на|к|ко|с|со|у|о|об|от|до|за|по|из|и|а|но|не|ни|да|ли|же|бы|для|без|под|над|при|про)[ \t]+(?=\S)/giu;

export function typography(text: string): string {
  return text.replace(shortWords, match => match.replace(/[ \t]+$/, '\u00a0'));
}
