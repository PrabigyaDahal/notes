import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
// import {nanoid} from "nanoid"
import "./style.css"
import { onSnapshot , addDoc , doc, deleteDoc, setDoc } from "firebase/firestore" // {onSnapShot} listens to any changes on database and runs based on that.
import {notesCollection ,db} from "./firebase"



export default function App() {
    const [notes, setNotes] = React.useState([])
    
    //Using arrow function in state initializes lazy state. That means the state is only run when the app first renders.
    //  getting notes saved in localstorage and if theres no array in local storage initializing a empty array. if nothing 
    // in local storage it returns null and json parse null is null. so it will initialize empty array.
        
    const [currentNoteId, setCurrentNoteId] = React.useState("")
    
    // Using useEffect to run a arrow function every time there is a change in note. It sets value to local storage.
    
    React.useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, function(snapshot) {
            // Sync up our local notes array with the snapshot data
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setNotes(notesArr)
        })
        return unsubscribe
    }, [])
   
    React.useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])

    
    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
    }
    
    async function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(docRef,
        { 
            body: text,
            updatedAt: Date.now() 
        },
        { merge: true })
    }

      
        // This does not rearange recently changed notes.
        // setNotes(oldNotes => oldNotes.map(oldNote => {
        //     return oldNote.id === currentNoteId
        //         ? { ...oldNote, body: text }
        //         : oldNote
        // }))
    
    async function deleteNote(noteId) {
        const docRef = doc(db, "notes", noteId)
        await deleteDoc(docRef)
    }

    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={sortedNotes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteCurrentNote={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
