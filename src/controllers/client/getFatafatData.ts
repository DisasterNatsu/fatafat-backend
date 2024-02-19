import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getDatabyDate = async (req: Request, res: Response) => {
  const date: string = req.params.date;

  try {
    const data = await prisma.fatafat.findUnique({
      where: {
        date: date,
      },
    });

    if (!data)
      return res
        .status(200)
        .json({ message: "No Data Yet for the date", displayDashes: true });

    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while finding the data", error });
  }
};

export const LastTenData = async (req: Request, res: Response) => {
  // Get the current date
  const currentDate = req.params.currentDate;

  try {
    const lastTen = await prisma.fatafat.findMany({
      where: {
        date: {
          // Filter out records from the current day
          not: {
            // Convert currentDate to ISO string to match Prisma's DateTime format
            equals: currentDate, // We only need the date part
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Order by createdAt in descending order
      },
      take: 10, // Fetch only the last ten records
    });

    return res.status(200).json(lastTen);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error while finding the data", error });
  }
};
