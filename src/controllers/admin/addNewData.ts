import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const validColumns = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
];

export const AddDataNewDataRow = async (req: Request, res: Response) => {
  const { gameNumber, date, gameResultPatti, gameResultNumber } = req.body;

  if (!gameNumber || !date || !gameResultPatti || !gameResultNumber) {
    return res.status(400).json("Bad request");
  }

  try {
    const data: any = {
      date: date,
    };

    data[gameNumber] = JSON.stringify({ gameResultPatti, gameResultNumber });

    if (!validColumns.includes(gameNumber)) {
      return res
        .status(400)
        .json({ message: `Invalid gameNumber: ${gameNumber}` });
    }

    const newRow = await prisma.fatafat.create({ data }); // create a new row

    return res
      .status(200)
      .json({ message: "New data was created successfully", newRow });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something happened while creating new row", error });
  }
};

export const updateOrAddDatatoAlreadyExistingRow = async (
  req: Request,
  res: Response
) => {
  const { gameNumber, date, gameResultPatti, gameResultNumber } = req.body; // get the data

  if (!gameNumber || !date || !gameResultPatti || !gameResultNumber) {
    return res.status(400).json("Bad request");
  }

  if (!validColumns.includes(gameNumber)) {
    return res
      .status(400)
      .json({ message: `Invalid gameNumber: ${gameNumber}` });
  }

  try {
    // check if the row with the date exists

    const doesRowExist = await prisma.fatafat.findUnique({
      where: { date: date },
    });

    // return if it doesn't

    if (!doesRowExist)
      return res
        .status(500)
        .json({ message: `There is not data for the provided date: ${date}` });

    // define data

    const data: any = {
      date: date,
    };

    data[gameNumber] = JSON.stringify({ gameResultPatti, gameResultNumber });

    // now update the data

    const updatedRow = await prisma.fatafat.update({
      data,
      where: {
        date: date,
      },
    });

    return res
      .status(200)
      .json({ message: "Data updated successfully", updatedRow });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something happened while creating new row", error });
  } finally {
    return async () => prisma.$disconnect();
  }
};
