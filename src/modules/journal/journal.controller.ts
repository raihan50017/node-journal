import { NextFunction, Request, Response } from "express";
import { journalService } from "./journal.service";
import { ApiError } from "../../errors/ApiError";
import { generateSlug } from "../../helpers/generateSlug";

/**
 * @objective create journal
 * @endpoint /v1/journal
 * @method POST
 */
const createJournal = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if(!req.file) {
      throw new ApiError('', 'image is required');
    }

    req.body.image = req.file.filename;
    req.body.slug = generateSlug(req.body.title);
    const journal = await journalService.createOne(req.body);

    return res.ok(journal);
  } catch (error) {
    next(error);
  }
};

/**
 * @objective get all journals
 * @endpoint /v1/journal
 * @method POST
 */
const getJournals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const journals = await journalService.findAllByQuery({
      select: { is_deleted: 0, __v: 0 },
    });

    return res.render("academic-journal", {
      journals: journals,
    });
  } catch (error) {
    next(error);
  }
};


/**
 * @objective get all journals
 * @endpoint /v1/journal
 * @method POST
 */
const getJournalDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const journal = await journalService.findAllByQuery({
      query: { slug: req.params.slug },
    });

    return res.render("journal-details", {
      journal: journal,
    });
  } catch (error) {
    next(error);
  }
};

export { createJournal, getJournals, getJournalDetails };
