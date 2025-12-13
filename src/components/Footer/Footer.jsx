import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import IconButton from '@mui/material/IconButton';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

const Footer = () => {
  return (
    <footer className='fixed bottom-0 left-0 z-[100] w-full py-3 px-2 bg-slate-400 flex items-center justify-between' >
      <IconButton>
        <HomeOutlinedIcon/>
      </IconButton>

      <IconButton>
        <AppsOutlinedIcon/>
      </IconButton>

      <IconButton>
        <AccountCircleOutlinedIcon/>
      </IconButton>
    </footer>
  )
}

export default Footer
