import { Dialog, DialogContent, DialogTitle, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import Note from "../../../interfaces/Note"
import { RootState } from "../../../store"
import { useAppSelector } from "../../../store/hooks";
import "./ViewNote.scss";

type ViewNoteProps = {
    id: string,
    resetData: Function
}

const ViewNote = ({ id, resetData }: ViewNoteProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const { notes } = useAppSelector((state: RootState) => state.notes);
    const [selectedData, setSelectedData] = useState<Note>();

    useEffect(() => {
        if (id) {
            const selectedData1 = notes?.find((item: any) => item.id === id);
            setSelectedData(selectedData1);
            setIsDialogOpen(true);
        }
        return () => {
            setIsDialogOpen(false);
        }
    }, [id, notes]);

    const handleClose = () => {
        setIsDialogOpen(false);
        resetData();
    }
    return (
        <>
            <Dialog open={isDialogOpen} onClose={handleClose}>
                <DialogTitle className="dialog-title">View Note</DialogTitle>
                <DialogContent>
                    <div className="notes-data-container">
                        <div>
                            <label><b>Title : </b></label>
                            <span>{selectedData?.title}</span>
                        </div>
                        <div className="content">
                            <label><b>Content : </b></label>
                            <span>{selectedData?.content}</span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ViewNote;