interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority?: "low" | "medium" | "high";
  completed: boolean;
  createdAt: string;
}

// Enhanced filter types
interface TaskFilters {
  status: "all" | "active" | "completed";
  priority?: "high" | "medium" | "low" | "none";
  dueDate?: "today" | "tomorrow" | "this-week" | "overdue" | "none";
  search?: string;
  sort: {
    field: "dueDate" | "priority" | "createdAt" | "title";
    direction: "asc" | "desc";
  };
}

// User settings types
interface UserSettings {
  defaultSort: {
    field: "dueDate" | "priority" | "createdAt" | "title";
    direction: "asc" | "desc";
  };
  defaultFilter: "all" | "active" | "completed";
}

export type { Task, TaskFilters, UserSettings };
