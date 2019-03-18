var subchapters = {}

export const subchaptersUtils = {
  setSuchapter: (chapterid, subsections) => {
    subchapters[chapterid] = subsections
  },
  getSubchapter: (chapterid) => {
    return subchapters[chapterid]
  }
}
