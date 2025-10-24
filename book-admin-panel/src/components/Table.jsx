import React from "react";

export default function Table({ columns = [], data = [], actions = [] }) {
    return (
        <div className="overflow-x-auto rounded border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((col, idx) => (
                            <th
                                key={idx}
                                className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                            >
                                {col.header}
                            </th>
                        ))}

                        {actions.length > 0 && (
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 bg-white">
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="hover:bg-gray-50 transition-colors duration-150"
                            >
                                {columns.map((col, colIndex) => {
                                    const value = row[col.accessor];

                                    if (col.accessor === "thumbnail" && value) {
                                        return (
                                            <td key={colIndex} className="px-4 py-3">
                                                <img
                                                    src={value}
                                                    alt={row.title}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                            </td>
                                        );
                                    }

                                    if (col.accessor === "images" && Array.isArray(value)) {
                                        return (
                                            <td key={colIndex} className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    {value.map((img, i) => (
                                                        <img
                                                            key={i}
                                                            src={img}
                                                            alt={row.title}
                                                            className="w-12 h-12 object-cover rounded"
                                                        />
                                                    ))}
                                                </div>
                                            </td>
                                        );
                                    }

                                    return (
                                        <td
                                            key={colIndex}
                                            className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap "
                                        >
                                            {value}
                                        </td>
                                    );
                                })}

                                {actions.length > 0 && (
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            {actions.map((action, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => action.onClick(row)}
                                                >
                                                    {action.icon}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                                className="px-4 py-6 text-center text-gray-500"
                            >
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
