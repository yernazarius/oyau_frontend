import Image from "next/image";

export default function WhyOYAU() {
  return (
    <div className="mx-24 mt-16 rounded-2xl bg-white shadow-lg">
      <div className="px-14 py-16">
        <div className="flex items-center mb-8">
          <h1 className="text-6xl font-semibold text-[#1A1A1A]">Почему</h1>
          <Image
            src="/Logo.svg"
            width={400}
            height={400}
            alt="Logo"
            className="w-48 mx-4 my-auto pt-2"
          />
          <h1 className="text-5xl font-semibold text-[#1A1A1A]">?</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mb-6">
          Наша система — это не просто CRM. Это инструмент, который позволяет
          оптимизировать работу команды и сфокусироваться на росте бизнеса.
        </p>
        <h3 className="text-2xl font-semibold mb-4 text-[#333]">
          Система позволяет:
        </h3>
        <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
          <li>
            Снизить нагрузку на менеджера и сосредоточиться на повышении
            клиентского чека
          </li>
          <li>Повысить эффективность управления производственным процессом</li>
          <li>Повысить контроль за назначениями и исполнением заказов</li>
          <li>Автоматизировать процесс подбора исполнителя</li>
          <li>Анализировать эффективность бизнес-процессов</li>
        </ul>
      </div>
    </div>
  );
}
