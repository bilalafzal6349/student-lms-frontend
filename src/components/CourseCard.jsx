import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Reusable course card used in course listings.
 */
const CourseCard = ({ course }) => {
  const {
    _id,
    title,
    description,
    category,
    price,
    averageRating,
    instructor,
    thumbnail,
  } = course;

  return (
    <Link to={`/courses/${_id}`} className="group block">
      <Card className="overflow-hidden h-full flex flex-col transition-shadow group-hover:shadow-md">
        <div className="h-40 bg-violet-50 flex items-center justify-center overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl">📚</span>
          )}
        </div>

        <CardContent className="flex flex-col gap-2 flex-1 pt-4">
          {category && (
            <Badge variant="secondary" className="w-fit text-xs">
              {category}
            </Badge>
          )}
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
          )}
          <div className="mt-auto flex items-center justify-between pt-2">
            <span className="text-sm font-bold text-gray-900">
              {price === 0 ? "Free" : `$${price}`}
            </span>
            {averageRating > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Star className="w-3 h-3 fill-yellow-400 stroke-yellow-400" />
                {averageRating.toFixed(1)}
              </span>
            )}
          </div>
          {instructor?.name && (
            <p className="text-xs text-gray-400">by {instructor.name}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default CourseCard;
