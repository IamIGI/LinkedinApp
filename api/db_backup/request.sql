--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

-- Started on 2023-06-28 16:06:22

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
-- TOC entry 215 (class 1259 OID 16580)
-- Name: request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.request (
    id integer NOT NULL,
    status character varying NOT NULL,
    "creatorId" integer,
    "receiverId" integer
);


ALTER TABLE public.request OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 16579)
-- Name: request_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.request_id_seq OWNER TO postgres;

--
-- TOC entry 3336 (class 0 OID 0)
-- Dependencies: 214
-- Name: request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.request_id_seq OWNED BY public.request.id;


--
-- TOC entry 3182 (class 2604 OID 16583)
-- Name: request id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request ALTER COLUMN id SET DEFAULT nextval('public.request_id_seq'::regclass);


--
-- TOC entry 3330 (class 0 OID 16580)
-- Dependencies: 215
-- Data for Name: request; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.request (id, status, "creatorId", "receiverId") VALUES (2, 'pending', 2, 3);
INSERT INTO public.request (id, status, "creatorId", "receiverId") VALUES (3, 'declined', 4, 3);
INSERT INTO public.request (id, status, "creatorId", "receiverId") VALUES (1, 'accepted', 1, 3);
INSERT INTO public.request (id, status, "creatorId", "receiverId") VALUES (4, 'pending', 3, 8);
INSERT INTO public.request (id, status, "creatorId", "receiverId") VALUES (5, 'accepted', 16, 3);
INSERT INTO public.request (id, status, "creatorId", "receiverId") VALUES (6, 'pending', 17, 2);
INSERT INTO public.request (id, status, "creatorId", "receiverId") VALUES (7, 'pending', 2, 7);
INSERT INTO public.request (id, status, "creatorId", "receiverId") VALUES (8, 'pending', 2, 4);
INSERT INTO public.request (id, status, "creatorId", "receiverId") VALUES (9, 'pending', 2, 12);
INSERT INTO public.request (id, status, "creatorId", "receiverId") VALUES (10, 'pending', 2, 5);


--
-- TOC entry 3337 (class 0 OID 0)
-- Dependencies: 214
-- Name: request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.request_id_seq', 10, true);


--
-- TOC entry 3184 (class 2606 OID 16587)
-- Name: request PK_167d324701e6867f189aed52e18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT "PK_167d324701e6867f189aed52e18" PRIMARY KEY (id);


--
-- TOC entry 3185 (class 2606 OID 16614)
-- Name: request FK_714f665dcb7ea33a577de776481; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT "FK_714f665dcb7ea33a577de776481" FOREIGN KEY ("creatorId") REFERENCES public."user"(id);


--
-- TOC entry 3186 (class 2606 OID 16619)
-- Name: request FK_e474c30f189e7757e3db67126a1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT "FK_e474c30f189e7757e3db67126a1" FOREIGN KEY ("receiverId") REFERENCES public."user"(id);


-- Completed on 2023-06-28 16:06:22

--
-- PostgreSQL database dump complete
--

