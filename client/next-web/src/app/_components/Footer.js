import { VscGithub } from 'react-icons/vsc';
import { FaDiscord, FaTwitter } from 'react-icons/fa';
import { Link } from '@nextui-org/link';

export default function Footer() {
  return (
    <footer className='pt-10 bg-white text-black'>
      <div className='flex justify-center py-4'>
        <Link
          className='basis-14 flex justify-center mr-5 text-blue-500'
          href='https://github.com/Shaunwei/RealChar'
          target='_blank'
          rel='noreferrer'
          aria-label='link to Github'
        >
          <VscGithub size={24} />
        </Link>
        <Link
          className='basis-14 flex justify-center mr-5 text-blue-500'
          href='/join-discord'
          target='_blank'
          rel='noreferrer'
          aria-label='link to Discord'
        >
          <FaDiscord size={24} />
        </Link>
        <Link
          className='basis-14 flex justify-center text-blue-500'
          href='https://twitter.com/agishaun'
          target='_blank'
          rel='noreferrer'
          aria-label='link to Twitter'
        >
          <FaTwitter size={24} />
        </Link>
      </div>
      <p className='copyright text-sm text-center my-7'>
        版权所有 © 2023 VerbaVista。保留所有权利。任何 AI 角色的陈述均为虚构，不代表实际信仰或观点。版本: {' '}
        {process.env.NEXT_PUBLIC_RC_BUILD_NUMBER}
      </p>

    </footer>
  );
}
