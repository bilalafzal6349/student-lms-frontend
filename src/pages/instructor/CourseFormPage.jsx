import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import api from "../../api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CATEGORIES = [
  "Math",
  "Science",
  "Programming",
  "Design",
  "Business",
  "Language",
  "Other",
];

/**
 * Shared create/edit form for instructor courses.
 */
const CourseFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: 0,
    thumbnail: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/courses/${id}`).then(({ data }) => {
      const { title, description, category, price, thumbnail } = data.course;
      setForm({
        title,
        description,
        category,
        price,
        thumbnail: thumbnail || "",
      });
    });
  }, [id]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isEdit) await api.put(`/courses/${id}`, form);
      else await api.post("/courses", form);
      navigate("/instructor/courses");
    } catch (err) {
      setError(err.response?.data?.error || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? "Edit Course" : "Create Course"}
      </h1>

      <Card>
        <CardContent className="pt-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. Introduction to React"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="What will students learn?"
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                >
                  <option value="">Select...</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min={0}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="thumbnail">Thumbnail URL</Label>
              <Input
                id="thumbnail"
                name="thumbnail"
                value={form.thumbnail}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : isEdit ? (
                  "Update Course"
                ) : (
                  "Create Course"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/instructor/courses")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseFormPage;
