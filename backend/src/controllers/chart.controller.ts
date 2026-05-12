import mongoose from "mongoose";
import { Response } from "express";

import { Expense } from "../models/Expense";

import { AuthRequest }
    from "../middlewares/auth.middleware";

export const getExpensesByCategory =
    async (
        req: AuthRequest,
        res: Response
    ) => {
        try {
            const userId =
                req.userId;

            const expenses =
                await Expense.aggregate([
                    {
                        $match: {
                            userId:
                                new mongoose.Types.ObjectId(
                                    userId
                                ),
                        },
                    },

                    {
                        $lookup: {
                            from: "categories",
                            localField:
                                "categoryId",
                            foreignField:
                                "_id",
                            as: "category",
                        },
                    },

                    {
                        $unwind:
                            "$category",
                    },

                    {
                        $group: {
                            _id:
                                "$category.name",

                            total: {
                                $sum:
                                    "$amount",
                            },
                        },
                    },

                    {
                        $sort: {
                            total: -1,
                        },
                    },
                ]);

            res.json(expenses);
        } catch (error) {
            console.error(
                error
            );

            res.status(500).json({
                message:
                    "Error getting chart data",
            });
        }
    };

export const getMonthlyExpenses =
    async (
        req: AuthRequest,
        res: Response
    ) => {
        try {
            const userId =
                req.userId;

            const expenses =
                await Expense.aggregate([
                    {
                        $match: {
                            userId:
                                new mongoose.Types.ObjectId(
                                    userId
                                ),
                        },
                    },

                    {
                        $group: {
                            _id: {
                                month: {
                                    $month:
                                        "$date",
                                },
                            },

                            total: {
                                $sum:
                                    "$amount",
                            },
                        },
                    },

                    {
                        $sort: {
                            "_id.month":
                                1,
                        },
                    },
                ]);

            res.json(expenses);
        } catch (error) {
            console.error(
                error
            );

            res.status(500).json({
                message:
                    "Error getting monthly expenses",
            });
        }
    };