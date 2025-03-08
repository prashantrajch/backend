import React, { useEffect, useState } from "react";
import NoteCard from "../../components/Cards/NoteCard/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstace from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar/Navbar";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/Cards/EmptyCard/EmptyCard";

export default function Home() {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg,setShowToastMsg]= useState({
    isShown: false,
    message: 'Hello World',
    type: 'add'
  })

  const [userInfo,setUserInfo] = useState(null);
  const[allNotes,setAllNotes] = useState([]);
  const [ isSearch,setIsSearch] = useState(false);

  const navigate = useNavigate();

  const handleEdit = (noteDetails)=>{
    setOpenAddEditModal({isShown: true,data: noteDetails, type: 'edit'})
  }

  const showToastMessage = (message,type) =>{
    setShowToastMsg({
      isShown: true,
      message: message,
      type: type
    })
  }

  const handleCloseToast = () =>{
    setShowToastMsg({
      isShown: false,
      message: '',
    })
  }

  const getUserInfo = async () =>{
    try{
      const response = await axiosInstace.get('/get-user');
      console.log(response.data)
      if(response.data && response.data.user){
        setUserInfo(response.data.user);
      }
    }catch(err){
      if(err.response.status === 401){
        localStorage.clear();
        navigate('/login');
      }
    }
  }

  //Get all notes
  const getAllNotes = async () => {
    try{
      const response = await axiosInstace.get('/allNotes')
      console.log(response.data)
      if(response.data && response.data.notes){
        setAllNotes(response.data.notes)
      }
    }catch(err){
      console.log("An unexcepted error")
    }
  }

  // Delete Note
  const deleteNote = async (id) =>{
    try{
      const response = await axiosInstace.delete(`/delete/${id}`)
      if(response.data && !response.data.error){
        showToastMessage(response.data.message,'delete')
        getAllNotes();
      }
    }catch(err){
      if(err.response && err.response.data && err.response.data.message){
        setError(err.response.data.message);
      }
    }
  }

  // Search for a Note
  const onSearchNote = async (query) =>{
    try{
      const response = await axiosInstace.get("/searchNotes",{
        params: {query},
      })
      if(response.data && response.data.notes){
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    }catch(err){
      console.log(err);
    }
    }

    const updateIsPinned = async (noteData) =>{
      try{
        const response = await axiosInstace.put(`/updatePinnedNote/${noteData._id}`,{
          isPinned: !noteData.isPinned
        })
        if(response.data && response.data.note){
          showToastMessage(response.data.message,'edit')
          getAllNotes();
        }
      }catch(err){
        if(err.response && err.response.data && err.response.data.message){
          setError(err.response.data.message);
        }
      }

    }

    const handleClearSearch = () =>{
      setIsSearch(false);
      getAllNotes();
    }

  useEffect(() =>{
    getAllNotes();
    getUserInfo();
    return () =>{}
  },[]);


  return (
    <>
    <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />
      <div className="container mx-auto">
        {
          allNotes.length > 0 ?
        <div className="grid grid-cols-3 gap-4 mt-8">
          {
           allNotes && allNotes.map((item,index) => 
              <NoteCard
              key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteNote(item._id)}
                onPinNote={() => updateIsPinned(item)}
              />
            )
          }
        </div>
        :
        <EmptyCard imgSrc={isSearch ? "NoDataImg" : "AddNotesTag"} message={ isSearch ? `Oops! No notes found matching you search.` : `Start creating your first note! Click the 'Add' button to write down your thoughts, ideas and reminders. Let's get started!`} />
        }
      </div>

      <button
        className=" w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll "
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() =>
            setOpenAddEditModal((prev) => {
              return { ...prev, isShown: false };
            })
          }
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast isShown={showToastMsg.isShown} message={showToastMsg.message} type={showToastMsg.type} onClose={handleCloseToast} />

    </>
  );
}
