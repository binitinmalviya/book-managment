import React from "react";
import { MoveUpRight, Book, ShoppingBag, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
    const cards = [
        {
            title: "Books",
            description: "Manage your entire book collection and inventory.",
            icon: <Book className="w-8 h-8 text-blue-600" />,
            link: "inventory",
            color: "blue",
        },
        {
            title: "Orders",
            description: "View and process customer orders efficiently.",
            icon: <ShoppingBag className="w-8 h-8 text-green-600" />,
            link: "orders",
            color: "green",
        },
        {
            title: "Revenue",
            description: "Analyze your sales performance and insights.",
            icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
            link: "revenue",
            color: "purple",
        },
    ];

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map((card) => (
                    <div
                        key={card.title}
                        className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between group"
                    >
                        <div>
                            <div className="flex items-center justify-between">
                                <div className="p-3 rounded-xl bg-gray-100">{card.icon}</div>
                                <Link
                                    to={card.link}
                                    className="text-gray-400 group-hover:text-gray-700 transition-all"
                                >
                                    <MoveUpRight className="w-5 h-5" />
                                </Link>
                            </div>

                            <h3 className="mt-4 text-xl font-semibold text-gray-800">
                                {card.title}
                            </h3>
                            <p className="text-gray-600 mt-1 text-sm">{card.description}</p>
                        </div>

                        <Link
                            to={card.link}
                            className={`mt-6 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-${card.color}-600 hover:bg-${card.color}-700 rounded-lg transition-all`}
                        >
                            View Details <MoveUpRight className="ml-2 w-4 h-4" />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
