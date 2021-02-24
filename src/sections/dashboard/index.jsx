import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { fetchMe } from '../../redux/actions/user';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import DescriptionIcon from '@material-ui/icons/Description';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Pagination from '@material-ui/lab/Pagination';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import polymathService from '../../services';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SearchIcon from '@material-ui/icons/Search';
import Fab from '@material-ui/core/Fab';
import { logOut } from "../../redux/actions/user";
import { makeStyles } from '@material-ui/core/styles';
import './index.scss'

const useStyles = makeStyles(() => ({
  ul: {
    "& .MuiPaginationItem-root": {
      color: "#fff"
    }
  },
  multilinecolor: {
    color: '#e1eaf2'
  }
}));

function Dashboard(props) {
  const [actuallTasks, setTasks] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [taskAction, setTaskAction] = useState({
    id: '',
    description: '',
    complete: false
  })
  const [isEdit, setIsEdit] = useState()
  const [size, setSize] = useState(window.innerWidth)
  const [searchDescription, setSearchDescription] = useState({
    description: ''
  });
  const [isSearch, setIsSearch] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    console.log('entroooo')
    searchTasks(currentPage)
  }, [currentPage])

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setTaskAction({
      id: '',
      description: ''
    })
    setOpen(false);
  };

  const openModal = (action, task) => {
    if(action == 'edit') {
      setTaskAction({
        id: task._id,
        description: task.description,
        complete: task.complete,
      });
      setIsEdit(true);
      setOpen(true);
    } else {
      setTaskAction({
        id: '',
        description: '',
        complete: false,
      });
      setIsEdit(false);
      setOpen(true);
    }
  }

  const sendTaskAction = async (action, task) => {
    let filters = {
      task: task
    }
    if(task.description != '') {
      if(action == 'edit') {
        await polymathService.updateTask(filters).then(event => {
          let newData = actuallTasks.items.map((actual) => {
            if(actual._id === event.data.task._id) {
              actual.description = task.description
              actual.complete = task.complete
            }
            return actual
          })
          setTasks({ ...actuallTasks, items: newData })
        })
        .catch((error) => {
          alert(error)
        })
      } else {
        delete filters.task['id']
        await polymathService.createTask(filters).then(event => {
            if(actuallTasks.items.length == 8) {
              setCurrentPage(parseInt(actuallTasks.total / 8) + 1)
            } else {
              let newData = actuallTasks.items;
              newData.push(event.data.task);
              if(actuallTasks.total == 0 ) {
                setCurrentPage(1)
              }
            }
        })
        .catch((error) => {
          alert(error)
        })
      }
    } else {
      alert('Description label can not be empty')
    }
    handleClose();
  }

  const searchTasks = async (paginationPage) => {
    let filters = {
      user: {
        id: props.user._id,
        page: paginationPage ? paginationPage : 1,
      }
    }
    await polymathService.searchTask(filters).then(event => {
      setTasks(event.data.tasks)
    })
  }

  const clearResults = () => {
    setIsSearch(false)
    if(actuallTasks.pages == currentPage) {
      setCurrentPage(1)
    } else {
      setCurrentPage(currentPage + 1)
    }
  }

  const deleteTask = async (task) => {
    console.log(currentPage)
    if (window.confirm("You will delete a task, do you want to continue?")) {
      let filters = {
        id: task
      }
      await polymathService.deleteTask(filters).then(event => {
        let newData = actuallTasks.items.filter(actual => actual._id !== filters.id)
        setTasks({ ...actuallTasks, items: newData })
        if (newData.length == 0 && currentPage > 0) {
          setCurrentPage(currentPage - 1)
        }
      }
      )
        .catch((error) => {
          console.log(error)
          alert('Task cant be deleted')
        })
    }
  }

  const getDescription = async (task) => {
    if (task) {
      let fields = {
        description: task
      }
      await polymathService.getTask(fields).then(event => {
        let newData = event.data.task;
        setTasks({ ...actuallTasks, items: newData })
        setIsSearch(true)
      }
      )
        .catch((error) => {
          console.log(error)
          alert('Task cant be founded')
        })
    } else {
      setCurrentPage(1)
    }
  }

  const logOut = () => {
    props.logOut();
    window.location.href = '/';
  }

  window.addEventListener("resize", updateSize);

  function updateSize() {
    setSize(window.innerWidth);
  }

  return (
    <div className="dashboard">
      <h2>Welcome to your dashboard {props.user.name}</h2>
      <div className="dashboard__box">
        <div className="dashboard__box__btn">
          <Button variant="contained" color="secondary" onClick={() => { openModal('create', taskAction)}}>
            Create task
          </Button>
          <div>
            <TextField 
            id="standard-search" 
            label="Search task"
            color="secondary" 
            InputLabelProps={{className: classes.multilinecolor}} 
            inputProps={{className: classes.multilinecolor}}
            onChange={event => setSearchDescription({...searchDescription, description: event.target.value})}
            />
            <Fab color="secondary" aria-label="add" size="small">
              <SearchIcon onClick={() => getDescription(searchDescription.description)}/>
            </Fab>
          </div>
        </div>
        <div className="dashboard__box__container">
        { actuallTasks && actuallTasks.items.length > 0 ?
          <>
            <List className={['dashboard__box__container__list' + ((size <= 410 && actuallTasks.pages >= 7) ? ' dashboard__box__container__list__mobile': '' )]}>
              {actuallTasks.items.map(task => {
                return (
                  <ListItem key={task._id}>
                    <ListItemAvatar>
                      <Avatar>
                        <DescriptionIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={task.description}
                    />
                    <div className="dashboard__box__container__list__icon">
                      <IconButton onClick={() => { openModal('edit', task)}}>
                        <EditIcon className="dashboard__box__container__list__icon__edit"/>
                      </IconButton>
                      <IconButton onClick={() => deleteTask(task._id)}>
                        <DeleteIcon className="dashboard__box__container__list__icon__delete"/>
                      </IconButton>
                    </div>
                  </ListItem>
                )
              }
              )}
            </List>
              {!isSearch ? <Pagination className="dashboard__box__container__pagination" classes={{ ul: classes.ul }} count={actuallTasks.pages} page={currentPage} onChange={(data, value) => { setCurrentPage(value) }} />
              :
              <div className="dashboard__box__container__pagination">
                <Button variant="contained" color="secondary" onClick={() => clearResults()}>
                  Clear results
                </Button>
              </div>
              }
            </>
            : !isSearch ? <h2>You dont have any task yet</h2> : 
            <>
            <h2>Task not founded</h2>
            <div className="dashboard__box__container__pagination">
                <Button variant="contained" color="secondary" onClick={() => clearResults()}>
                  Clear results
                </Button>
              </div>
            </>}
          </div>
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open} className="dashboard__card">
          <div>
            <div className="dashboard__card__container">
              <h2 id="transition-modal-title">{isEdit ? 'Edit your task' : 'Create your task'}</h2>
              <TextField className="dashboard__card__container__input" label="Description" value={taskAction.description} onChange={event => { setTaskAction({ ...taskAction, description: event.target.value }) }} />
              <div className="dashboard__card__container__checkbox">
                <Checkbox checked={taskAction.complete} onChange={event => { setTaskAction({ ...taskAction, complete: event.target.checked }) }} name="finished" />
                <span><strong>Finished</strong></span>
              </div>
              <div className="dashboard__card__container__btn">
                <Button variant="contained" color="secondary" onClick={() => handleClose()}>
                  Cancel
                </Button>
                {isEdit ? 
                  <Button variant="contained" color="primary" onClick={() => sendTaskAction('edit', taskAction)}>
                    Edit
                  </Button> :
                  <Button variant="contained" color="primary" onClick={() => sendTaskAction('create', taskAction)}>
                    Create
                  </Button>}
              </div>
            </div>
          </div>
        </Fade>
      </Modal>
      <div className="dashboard__logout">
        <IconButton onClick={() => logOut()}>
          <ExitToAppIcon className="dashboard__logout__icon"/>
        </IconButton>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user.data,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchMe: () => {
      return dispatch(fetchMe());
    },
    logOut: () => {
      return dispatch(logOut());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);