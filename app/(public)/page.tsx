'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/language-context'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const { dict } = useLanguage()
  const heroStats = [
    { num: '248', label: dict.home.heroStats.passages },
    { num: '2', label: dict.home.heroStats.languages },
    { num: '6', label: dict.home.heroStats.gradeLevels },
  ]
  const featureIcons = ['📚', '🧒', '🤖', '✏️', '📈', '🗂️']
  const featureHrefs = ['/repository', '/profiles', '/content', '/assessments', '/reports', '/resources']
  const stepColors = ['#FFC64B', '#FF8A5B', '#29B6A4']

  return (
    <main className="max-w-[1240px] mx-auto px-7">
      <section className="grid grid-cols-[1.05fr_.95fr] gap-10 items-center py-14">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#FFE7B8] text-[#B87B12] font-extrabold text-sm px-4 py-2 rounded-full mb-5">
            ✨ {dict.home.tagline}
          </div>
          <h1 className="font-display font-bold text-[56px] leading-[1.04] tracking-[-1.5px] text-ink">{dict.home.heroTitle}</h1>
          <p className="text-lg leading-relaxed text-inkSub my-6 max-w-[520px]">{dict.home.heroSub}</p>
          <div className="flex gap-3.5 flex-wrap">
            <Link href="/repository"><Button variant="primary">{dict.home.startReading}</Button></Link>
            <Link href="/login"><Button variant="secondary">{dict.home.teacherLogin}</Button></Link>
          </div>
          <div className="flex gap-8 mt-10">
            {heroStats.map((s) => (
              <div key={s.label}>
                <div className="font-display font-bold text-3xl text-coral leading-none">{s.num}</div>
                <div className="text-sm font-bold text-inkMuted mt-1.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative h-[420px]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFD98A] to-[#FFB05B] rounded-[34px] rotate-[-3deg]" />
          <div className="absolute inset-0 bg-white rounded-[34px] border-[3px] border-ink flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b-2 border-dashed border-cardBorder flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFE7B8] grid place-items-center text-lg">📚</div>
              <div className="font-display font-semibold">{dict.home.todaysReading}</div>
            </div>
            <div className="flex-1 p-5 flex items-center justify-center text-6xl">🐃</div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <h2 className="font-display font-bold text-4xl tracking-[-.5px] mb-1.5">{dict.home.exploreTitle}</h2>
        <p className="text-lg text-inkSub mb-7">{dict.home.exploreSub}</p>
        <div className="grid grid-cols-3 gap-5">
          {dict.home.features.map((f, i) => (
            <Link key={f.title} href={featureHrefs[i]} className="bg-white border-2 border-cardBorder rounded-[22px] p-6 block">
              <div className="w-14 h-14 rounded-2xl grid place-items-center text-2xl bg-[#FFE0D8]">{featureIcons[i]}</div>
              <div className="font-display font-semibold text-xl mt-4">{f.title}</div>
              <p className="text-sm text-inkSub leading-relaxed mt-2">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="my-11 bg-gradient-to-br from-ink to-[#453F58] rounded-[30px] p-11 text-white grid grid-cols-2 gap-11 items-center">
        <div>
          <h2 className="font-display font-bold text-3xl tracking-[-.5px]">{dict.home.howTitle}</h2>
          <p className="text-base text-[#C9C3D6] mt-3 leading-relaxed">{dict.home.howSub}</p>
        </div>
        <div className="flex flex-col gap-4">
          {dict.home.steps.map((s, i) => (
            <div key={s.title} className="flex gap-4 items-center bg-white/10 rounded-2xl p-4">
              <div className="w-11 h-11 flex-shrink-0 rounded-xl grid place-items-center font-display font-bold text-lg text-ink" style={{ background: stepColors[i] }}>
                {i + 1}
              </div>
              <div>
                <div className="font-display font-semibold text-lg">{s.title}</div>
                <div className="text-sm text-[#C9C3D6] mt-0.5">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
