import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, Loader2, Trash2, PlayCircle } from "lucide-react";
import api from "../api/axios";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { useConfirm } from "../components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const CourseDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const confirm = useConfirm();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewError, setReviewError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, reviewRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get(`/courses/${id}/reviews`),
        ]);
        setCourse(courseRes.data.course);
        setReviews(reviewRes.data.reviews);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await api.post("/enroll", { courseId: id });
      setEnrolled(true);
    } catch (err) {
      alert(err.response?.data?.error || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setReviewError("");
    setSubmitting(true);
    try {
      const { data } = await api.post(`/courses/${id}/reviews`, reviewForm);
      setReviews((r) => [data.review, ...r]);
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      const status = err.response?.status;
      setReviewError(
        status === 409
          ? "You have already reviewed this course."
          : err.response?.data?.error || "Failed to submit review",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const ok = await confirm({
      title: "Delete your review?",
      description: "This review will be permanently removed.",
    });
    if (!ok) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviews((r) => r.filter((rev) => rev._id !== reviewId));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete review");
    }
  };

  if (loading) return <Spinner />;
  if (!course)
    return <p className="text-center py-20 text-gray-500">Course not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-linear-to-br from-violet-50 to-white rounded-2xl p-6 mb-8 border border-violet-100">
        <Badge variant="secondary" className="mb-3">
          {course.category}
        </Badge>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {course.title}
        </h1>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
          <span>
            by{" "}
            <strong className="text-gray-800">{course.instructor?.name}</strong>
          </span>
          {course.averageRating > 0 && (
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
              {course.averageRating.toFixed(1)}
            </span>
          )}
          <span className="text-xl font-bold text-gray-900">
            {course.price === 0 ? "Free" : `$${course.price}`}
          </span>
        </div>
        {isAuthenticated && user?.role === "student" && !enrolled && (
          <Button onClick={handleEnroll} disabled={enrolling} className="mt-4">
            {enrolling ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Enrolling...
              </>
            ) : (
              "Enroll Now"
            )}
          </Button>
        )}
        {enrolled && (
          <p className="mt-4 text-green-600 font-medium text-sm">
            ✓ Enrolled successfully!
          </p>
        )}
      </div>

      {/* Lessons */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Lessons{" "}
          <span className="text-gray-400 font-normal text-base">
            ({course.lessons?.length || 0})
          </span>
        </h2>
        {course.lessons?.length === 0 ? (
          <p className="text-gray-500 text-sm">No lessons yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {course.lessons?.map((lesson, i) => (
              <Card key={lesson._id}>
                <CardContent className="flex items-center gap-3 py-3">
                  <span className="w-7 h-7 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-800 flex-1">
                    {lesson.title}
                  </span>
                  {lesson.videoUrl && (
                    <PlayCircle className="w-4 h-4 text-violet-400 shrink-0" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Separator className="mb-10" />

      {/* Reviews */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>

        {isAuthenticated && user?.role === "student" && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Leave a review
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reviewError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-3">
                  {reviewError}
                </div>
              )}
              <form onSubmit={handleReview} className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Rating:
                  </label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) =>
                      setReviewForm((f) => ({
                        ...f,
                        rating: Number(e.target.value),
                      }))
                    }
                    className="flex h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} ★
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm((f) => ({ ...f, comment: e.target.value }))
                  }
                  placeholder="Share your experience..."
                  rows={3}
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 resize-none"
                />
                <Button
                  type="submit"
                  disabled={submitting}
                  size="sm"
                  className="self-end"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">No reviews yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {reviews.map((r) => (
              <Card key={r._id}>
                <CardContent className="py-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {r.student?.name?.[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-800">
                        {r.student?.name}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < r.rating ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    {user && r.student?._id === user._id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteReview(r._id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                  {r.comment && (
                    <p className="text-sm text-gray-600">{r.comment}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CourseDetailPage;
