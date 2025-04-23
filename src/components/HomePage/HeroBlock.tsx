import Image from 'next/image'
import Link from 'next/link'

export default function HeroBlock() {

	return (
		<div className='relative'>
			<div className="mx-24 mt-16 rounded-2xl bg-white">
				<div className='py-64 pl-14 w-3/5'>
					<h1 className="text-5xl font-medium text-left">Ваш путь к успешным отношениям с клиентами</h1>
					<p className="text-4xl font-thin text-left pt-8">CRM система, в которой каждый найдет что-то для себя</p>
					<div className='pt-8 flex flex-row gap-5'>
						<Link href="#" className='bg-[#5885EA] border border-[#5885EA] text-white p-4 rounded-3xl'>Начать бесплатно</Link>
						<Link href="#" className='border-2 border-[#5885EA] rounded-3xl p-4 text-[#5885EA]' >Попробовать демо</Link>
					</div>
				</div>
			</div>
			<div className='absolute top-10 right-28 z-20 w-[35%] '>
				<Image src="/hero-block-dashboard.png" width={800} height={800} alt="HeroBlock" className='w-full h-auto rounded-xl' />
			</div>
			<div className='absolute top-48 right-0 z-10 w-[30%] ml-10'>
				<Image src="/hero-block-clients.png" width={800} height={800} alt="HeroBlock" className='w-full h-auto rounded-xl' />
			</div>
			<div className='absolute top-[22rem] right-56 z-[5] w-[30%] ml-10'>
				<Image src="/hero-pyatnyshki.png" width={800} height={800} alt="HeroBlock" className='w-full h-auto' />
			</div>
		</div>
	)
}
