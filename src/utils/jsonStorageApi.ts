import { Task } from "@/types/task";

const STORAGE_URL = process.env.NEXT_PUBLIC_JSON_STORAGE_URL;
const API_KEY = process.env.NEXT_PUBLIC_JSON_STORAGE_API_KEY;

if (!STORAGE_URL) {
  throw new Error("STORAGE_URL is not defined");
}

const STORAGE_WRITE_URL = `${STORAGE_URL}?apiKey=${API_KEY}`;

export const getTasksFromStorage = async (): Promise<Task[]> => {
  try {
    const response = await fetch(STORAGE_URL);
    if (!response.ok)
      throw new Error(`Failed to fetch tasks: ${response.statusText}`);
    const data = await response.json();
    return data.tasks || [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

export const saveTasksToStorage = async (tasks: Task[]): Promise<boolean> => {
  try {
    const response = await fetch(STORAGE_WRITE_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tasks }),
    });
    if (!response.ok) {
      throw new Error(`Failed to save tasks: ${response.statusText}`);
    }
    return true;
  } catch (error) {
    console.error("Error saving tasks:", error);
    return false;
  }
};
