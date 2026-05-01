import { Router } from "express";
import { getAlbum, listAlbums, searchAlbums } from "../controllers/album.controller.js";

const router = Router();

router.get("/", listAlbums);
router.get("/search", searchAlbums);
router.get("/:id", getAlbum);

export default router;