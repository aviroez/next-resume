export default function generateSlug(word: string) {
    return word.replaceAll(' ', '-').toLowerCase()
}