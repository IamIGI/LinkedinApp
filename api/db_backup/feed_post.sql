--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

-- Started on 2023-06-28 16:07:25

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16601)
-- Name: feed_post; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.feed_post (
    id integer NOT NULL,
    "imageName" character varying,
    content character varying NOT NULL,
    likes integer DEFAULT 0 NOT NULL,
    comments integer DEFAULT 0 NOT NULL,
    shared integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "authorId" integer
);


ALTER TABLE public.feed_post OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16600)
-- Name: feed_post_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.feed_post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.feed_post_id_seq OWNER TO postgres;

--
-- TOC entry 3340 (class 0 OID 0)
-- Dependencies: 218
-- Name: feed_post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.feed_post_id_seq OWNED BY public.feed_post.id;


--
-- TOC entry 3182 (class 2604 OID 16604)
-- Name: feed_post id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feed_post ALTER COLUMN id SET DEFAULT nextval('public.feed_post_id_seq'::regclass);


--
-- TOC entry 3334 (class 0 OID 16601)
-- Dependencies: 219
-- Data for Name: feed_post; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.feed_post (id, "imageName", content, likes, comments, shared, "createdAt", "updatedAt", "authorId") VALUES (1, '35f47b29-72ec-4348-9422-08a52115bb38.JPG', '123dawdwa', 0, 0, 0, '2023-06-24 15:29:15.487789', '2023-06-24 15:29:15.487789', 1);
INSERT INTO public.feed_post (id, "imageName", content, likes, comments, shared, "createdAt", "updatedAt", "authorId") VALUES (2, 'abf406b0-f815-4521-838c-2d0897b690ad.JPG', '123daw', 0, 0, 0, '2023-06-24 15:29:28.592114', '2023-06-24 15:29:28.592114', 1);
INSERT INTO public.feed_post (id, "imageName", content, likes, comments, shared, "createdAt", "updatedAt", "authorId") VALUES (3, '4499eff7-81e8-4eef-ad1e-a38f053dd3e8.JPG', '12312daw', 0, 0, 0, '2023-06-24 15:52:51.868306', '2023-06-24 15:52:51.868306', 2);
INSERT INTO public.feed_post (id, "imageName", content, likes, comments, shared, "createdAt", "updatedAt", "authorId") VALUES (4, 'cc3769f0-fd1d-4809-b820-026471c34126.PNG', 'Cola time', 0, 0, 0, '2023-06-25 08:49:19.01901', '2023-06-25 08:49:19.01901', 3);
INSERT INTO public.feed_post (id, "imageName", content, likes, comments, shared, "createdAt", "updatedAt", "authorId") VALUES (5, '6b74540f-ccc2-4ff9-b00f-61633387da38.PNG', 'chemy', 0, 0, 0, '2023-06-27 11:19:32.103994', '2023-06-27 11:19:32.103994', 16);
INSERT INTO public.feed_post (id, "imageName", content, likes, comments, shared, "createdAt", "updatedAt", "authorId") VALUES (6, 'a0df15b7-1fbe-4b88-96f7-bb747a10475b.JPG', 'rdadaw', 0, 0, 0, '2023-06-27 11:24:32.165905', '2023-06-27 11:24:32.165905', 16);
INSERT INTO public.feed_post (id, "imageName", content, likes, comments, shared, "createdAt", "updatedAt", "authorId") VALUES (7, 'c35ab553-b48a-4065-bc5f-cb1ea680bcbe.PNG', 'test123234dasdwa12312', 0, 0, 0, '2023-06-28 15:58:36.606469', '2023-06-28 15:59:33.376', 2);


--
-- TOC entry 3341 (class 0 OID 0)
-- Dependencies: 218
-- Name: feed_post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.feed_post_id_seq', 7, true);


--
-- TOC entry 3189 (class 2606 OID 16613)
-- Name: feed_post PK_1dd475e18c5436c2bd0e56db39a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feed_post
    ADD CONSTRAINT "PK_1dd475e18c5436c2bd0e56db39a" PRIMARY KEY (id);


--
-- TOC entry 3190 (class 2606 OID 16624)
-- Name: feed_post FK_775f4cfee914a573dc1cac42d32; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feed_post
    ADD CONSTRAINT "FK_775f4cfee914a573dc1cac42d32" FOREIGN KEY ("authorId") REFERENCES public."user"(id);


-- Completed on 2023-06-28 16:07:26

--
-- PostgreSQL database dump complete
--

