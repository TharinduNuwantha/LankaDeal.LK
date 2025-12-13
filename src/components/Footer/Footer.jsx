import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import IconButton from '@mui/material/IconButton';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

const Footer = () => {
  return (
    <footer className='fixed bottom-0 left-0 z-[100] w-full p-3 bg-slate-300 flex items-center justify-between' >

    <FooterIcon Icon={HomeOutlinedIcon} text={"Home"}/>
    <FooterIcon Icon={AppsOutlinedIcon} text={"Category"}/>
    <FooterIcon Icon={AccountCircleOutlinedIcon} text={"Account"}/>
    </footer>
  )
}

export default Footer

const FooterIcon = ({Icon,text}) =>(
  <IconButton sx={{
    padding:"4px",
    paddingTop:'0px',
    borderRadius:"5px",
    color:"red"
  }}>
    <div className='text-gray-700 hover:text-[#f54c4c] transition-all duration-300'>
      <Icon/>
        <p className='text-xs font-semibold'>{text}</p>
    </div>
  </IconButton>
) 
