import { useState, useEffect, useMemo } from "react";
import { API_BASE, authFetch } from "../api/client.js";

const authFetchJson = async (url, options) => {
  const r = await authFetch(url, options);
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.message || "Request failed");
  return data;
}

export const useAdminTracks = () => {
    const [formData, setFormData] = useState({
        tracks: [],
        title: "",
        genre: "pop",
        selectedArtistIds: [],
        album: "",
        audioFile: null,
        coverFile: null,
        lyrics: "",
    });

    const [refreshKey, setRefreshKey] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadMsg, setUploadMsg] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const { tracks, title, genre, selectedArtistIds, album, audioFile, coverFile, lyrics } = formData;

    const canSubmit = useMemo(
        () => formData.title.trim() && formData.selectedArtistIds.length > 0 && formData.audioFile,
        [formData.title, formData.selectedArtistIds, formData.audioFile]
    );

    useEffect(() => {
        authFetchJson(`${API_BASE}/admin/tracks`)
        .then((res) => {
        setFormData(prev => ({ 
            ...prev, 
            tracks: Array.isArray(res) ? res : res?.data || [] 
        }));
        })
        .catch(console.error);
    }, [refreshKey]);

    const resetForm = () => {
        setFormData((prev) => ({
        ...prev,
        title: "",
        genre: "pop",
        selectedArtistIds: [],
        album: "",
        audioFile: null,
        coverFile: null,
        lyrics: "",
        }));
    };

    const setFormField = (field, value) => {
        setFormData((prev) => ({...prev, [field]: value}));
    };

     const onSubmit = async (e) => {
        e.preventDefault();
        if (!canSubmit || uploading) return;

        setUploading(true);
        setUploadMsg("");
        setIsSuccess(false);

        const fd = new FormData();
        fd.append("title", title);
        fd.append("genre", genre);
        fd.append("artistIds", JSON.stringify(selectedArtistIds));
        if (album) fd.append("albumId", album);
        fd.append("audio", audioFile);
        if (coverFile) fd.append("cover", coverFile);
        if (lyrics) fd.append("lyrics", lyrics);

        try {
        const res = await authFetchJson(`${API_BASE}/admin/tracks`, { method: "POST", body: fd });
        setIsSuccess(true);
        setUploadMsg("File Uploaded! Track has been added.");
        resetForm();
        setRefreshKey((k) => k + 1);
        } catch (err) {
        setIsSuccess(false);
        setUploadMsg(`${err.message || "Upload failed"}`);
        } finally {
        setUploading(false);
        }
    };

    const confirmDelete = async () => {
        if (!confirmDeleteId || deleting) return;
        setDeleting(true);
        try {
        const r = await authFetchJson(`${API_BASE}/admin/tracks/${confirmDeleteId}`, { method: "DELETE" });
        setFormData(prev => ({...prev, tracks: prev.tracks.filter((t) => t.id !== confirmDeleteId)}));
        setIsSuccess(true);
        setUploadMsg("Track successfully deleted.");
        } catch (err) {
        setIsSuccess(false);
        setUploadMsg(`${err.message || "Failed to delete track."}`);
        } finally {
        setDeleting(false);
        setConfirmDeleteId(null);
        }
    };

    return {
        tracks,
        title,
        genre,
        selectedArtistIds,
        album,
        audioFile,
        coverFile,
        lyrics,
        uploading,
        uploadMsg,
        isSuccess,
        confirmDeleteId,
        deleting,
        canSubmit,

        setFormField,
        setConfirmDeleteId,
        onSubmit,
        confirmDelete,
    };

};