import { Link } from "react-router-dom";
import { BookOpen, Users, Award, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { label: "Courses", value: "100+" },
  { label: "Students", value: "5,000+" },
  { label: "Instructors", value: "50+" },
  { label: "Categories", value: "7" },
];

const values = [
  {
    Icon: BookOpen,
    title: "Quality Content",
    desc: "Every course is reviewed for accuracy and depth before publishing.",
  },
  {
    Icon: Users,
    title: "Community First",
    desc: "We believe learning is better together. Connect, discuss, and grow.",
  },
  {
    Icon: Award,
    title: "Certified Learning",
    desc: "Complete courses and earn certificates to showcase your skills.",
  },
  {
    Icon: Target,
    title: "Goal Oriented",
    desc: "Structured paths designed to take you from beginner to job-ready.",
  },
];

const AboutPage = () => (
  <div className="min-h-screen bg-white">
    {/* Hero */}
    <section className="bg-linear-to-br from-violet-50 to-white py-20 px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">About LearnHub</h1>
      <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
        LearnHub is a modern learning management system built to connect
        passionate instructors with curious students. We make quality education
        accessible to everyone.
      </p>
      <Button asChild>
        <Link to="/courses">Explore Courses</Link>
      </Button>
    </section>

    {/* Stats */}
    <section className="max-w-4xl mx-auto px-4 py-16">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        {stats.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1">
            <span className="text-3xl font-bold text-violet-600">{value}</span>
            <span className="text-sm text-gray-500">{label}</span>
          </div>
        ))}
      </div>
    </section>

    {/* Mission */}
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed">
          We believe that education should be accessible, affordable, and
          effective. LearnHub was built to give instructors the tools to share
          their expertise and give students the flexibility to learn on their
          own terms — anytime, anywhere.
        </p>
      </div>
    </section>

    {/* Values */}
    <section className="max-w-5xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
        What We Stand For
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {values.map(({ Icon, title, desc }) => (
          <Card key={title}>
            <CardContent className="flex gap-4 pt-6">
              <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="bg-violet-600 py-16 px-4 text-center text-white">
      <h2 className="text-2xl font-bold mb-3">Ready to start learning?</h2>
      <p className="text-violet-200 mb-6">
        Join thousands of students already on LearnHub.
      </p>
      <div className="flex gap-3 justify-center flex-wrap  ">
        <Button
          variant="outline"
          className="text-violet-700 border-white hover:bg-violet-700 hover:text-white"
          asChild
        >
          <Link to="/register">Create Free Account</Link>
        </Button>
        <Button
          variant="outline"
          className="text-violet-700 border-white hover:bg-violet-700 hover:text-white"
          asChild
        >
          <Link to="/courses">Browse Courses</Link>
        </Button>
      </div>
    </section>
  </div>
);

export default AboutPage;
