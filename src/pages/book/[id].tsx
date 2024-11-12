import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import style from "./[id].module.css";
import fetchBooksId from "@/lib/fetch-random-books-id";
import { useRouter } from "next/router";
import Head from "next/head";

export const getStaticPaths = () => {
  // 다이나믹 페이지 ssg 사전랜더링 시 패스 선서
  return {
    paths: [
      { params: { id: "1" } },
      { params: { id: "2" } },
      { params: { id: "3" } },
    ],
    fallback: true,
    //false not pound page
    //blocking ssr 식으로 사전렌더링 해서 제공 그후는 ssg 식으로
    //true blocking시 로딩 props 없이 ui 먼저 주고 그 후 데이터 전달
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const id = context.params!.id;
  const data = await fetchBooksId(Number(id));

  return {
    props: { data },
  };
};
export default function Page({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();
  if (router.isFallback) {
    // SSG 생성시 패스 지정아닌것들은 페이지 생성전에 보여질 헤더 설정 해주면 좋음
    return (
      <Head>
        <title>한입북스</title>
        <meta property="og:image" content="/thumbnail.png" />
        <meta property="og:title" content="한입북스" />
        <meta
          property="og:description"
          content="한입북스 등록된 도서들을 만나보세요"
        />
      </Head>
    );
  }
  if (!data)
    return {
      notFound: true,
    };

  const { title, subTitle, description, author, publisher, coverImgUrl } = data;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:image" content={coverImgUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Head>
      <div className={style.container}>
        <div
          style={{ backgroundImage: `url('${data.coverImgUrl}')` }}
          className={style.cover_img_container}
        >
          <img src={coverImgUrl} />
        </div>
        <div className={style.title}>{title}</div>
        <div className={style.subTitle}>{subTitle}</div>
        <div className={style.author}>
          {author}|{publisher}
        </div>
        <div className={style.description}>{description}</div>
      </div>
    </>
  );
}
