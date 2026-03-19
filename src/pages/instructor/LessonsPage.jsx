import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader2, Trash2, Video, GripVertical } from "lucide-react";
import api from "../../api/axios";
import Spinner from "../../components/Spinner";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LessonsPage = () => {
  const { id: courseId } = useParams();
  const confirm = useConfirm();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    content: "",
    videoUrl: "",
    order: 1,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchCourse = async () => {
    const { data } = await api.get(`/courses/${courseId}`);
    setCourse(data.course);
    setLoading(false);
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.post("/lessons", { ...form, courseId });
      await fetchCourse();
      setForm({
        title: "",
        content: "",
        videoUrl: "",
        order: (course?.lessons?.length || 0) + 2,
      });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add lesson");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (lessonId, lessonTitle) => {
    const ok = await confirm({
      title: `Delete "${lessonTitle}"?`,
      description: "This lesson will be permanently removed from the course.",
    });
    if (!ok) return;
    try {
      await api.delete(`/lessons/${lessonId}`);
      await fetchCourse();
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lessons</h1>
        <p className="text-sm text-gray-500 mt-1">{course?.title}</p>
      </div>

      <div className="flex flex-col gap-2 mb-8">
        {course?.lessons?.length === 0 && (
          <p className="text-gray-500 text-sm py-4 text-center">
            No lessons yet. Add your first one below.
          </p>
        )}
        {course?.lessons?.map((lesson, i) => (
          <Card key={lesson._id}>
            <CardContent className="flex items-center gap-3 py-3">
              <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
              <span className="w-6 h-6 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {lesson.title}
                </p>
                {lesson.videoUrl && (
                  <p className="text-xs text-violet-500 flex items-center gap-1 mt-0.5">
                    <Video className="w-3 h-3" /> Video attached
                  </p>
                )}
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(lesson._id, lesson.title)}
                className="h-7 w-7 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Add Lesson</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleAdd} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lessonTitle">Title *</Label>
              <Input
                id="lessonTitle"
                placeholder="e.g. Introduction to Variables"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lessonContent">Content</Label>
              <textarea
                id="lessonContent"
                placeholder="Lesson content (markdown or plain text)"
                value={form.content}
                onChange={(e) =>
                  setForm((f) => ({ ...f, content: e.target.value }))
                }
                rows={3}
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 resize-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="videoUrl">Video URL (optional)</Label>
              <Input
                id="videoUrl"
                placeholder="https://youtube.com/..."
                value={form.videoUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, videoUrl: e.target.value }))
                }
              />
            </div>
            <Button type="submit" disabled={saving} className="self-start">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Adding...
                </>
              ) : (
                "Add Lesson"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonsPage;
