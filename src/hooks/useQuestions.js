import { get, getDatabase, orderByKey, query, ref } from "firebase/database";
import { useEffect, useState } from "react";

export default function useQuestions(videoID) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    async function fetchQuestions() {
      const db = getDatabase();
      const quizRef = ref(db, "quiz/" + videoID + "/questions");
      const quizQuery = query(quizRef, orderByKey());
      console.log(quizQuery);
      try {
        setError(false);
        setLoading(true);
        const snapshots = await get(quizQuery);
        setLoading(false);
        if (snapshots.exists()) {
          setQuestions((prevQuestions) => {
            return [...prevQuestions, ...Object.values(snapshots.val())];
          });
        }
        console.log(snapshots.val());
      } catch (err) {
        setLoading(false);
        setError(true);
      }
    }
    fetchQuestions();
  }, [videoID]);
  return { loading, error, questions };
}
