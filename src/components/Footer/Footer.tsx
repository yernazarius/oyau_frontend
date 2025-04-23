import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white mt-24 py-12 px-24 border-t border-gray-200">
      <div className="flex justify-between items-start flex-wrap gap-12">
        {/* Logo + Description */}
        <div className="max-w-sm">
          <Image
            src="/Logo.svg"
            width={150}
            height={150}
            alt="Logo"
            className="mb-4"
          />
          <p className="text-gray-600 text-sm">
            Система управления, которая помогает развивать ваш бизнес,
            автоматизировать процессы и укреплять отношения с клиентами.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Навигация</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <Link href="#" className="hover:text-[#5885EA]">
                Главная
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-[#5885EA]">
                О нас
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-[#5885EA]">
                Вопросы
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-[#5885EA]">
                Контакты
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Контакты</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              Email:{" "}
              <a
                href="mailto:support@oyau.com"
                className="hover:text-[#5885EA]"
              >
                support@oyau.com
              </a>
            </li>
            <li>
              Телефон:{" "}
              <a href="tel:+77001234567" className="hover:text-[#5885EA]">
                +7 (700) 123-45-67
              </a>
            </li>
            <li>Made with love in Astana❤️</li>
          </ul>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-12 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} OYAU CRM. Все права защищены.
      </div>
    </footer>
  );
}
