export interface Subtopic {
  name: string;
  content: string;
}

export interface Topic {
  name: string;
  content: string;
  subtopics: Subtopic[];
}

export interface Course {
  courseName: string;
  topics: Topic[];
  subHeading: string;
  price: string;
}

export interface SelectedIndexes {
  topicIndex: number | null;
  subtopicIndex: number | null;
}
