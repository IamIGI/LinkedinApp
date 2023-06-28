--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

-- Started on 2023-06-28 16:07:06

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
-- TOC entry 217 (class 1259 OID 16589)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    "firstName" character varying NOT NULL,
    "lastName" character varying,
    email character varying NOT NULL,
    password character varying NOT NULL,
    "profileImagePath" character varying,
    "backgroundImagePath" character varying,
    role public.user_role_enum DEFAULT 'premium'::public.user_role_enum NOT NULL,
    company character varying,
    "position" character varying,
    education character varying,
    subscribers integer,
    "isPrivateAccount" boolean NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16588)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO postgres;

--
-- TOC entry 3337 (class 0 OID 0)
-- Dependencies: 216
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- TOC entry 3182 (class 2604 OID 16592)
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- TOC entry 3331 (class 0 OID 16589)
-- Dependencies: 217
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."user" (id, "firstName", "lastName", email, password, "profileImagePath", "backgroundImagePath", role, company, "position", education, subscribers, "isPrivateAccount") VALUES (4, 'JanekAccount', NULL, 'janek@gmail.com', '$2b$12$NojiRnlxf5azgIiW4Bum6uwSWlKKIzh.qYhte6DLS9kJtOlpAnjcm', NULL, NULL, 'premium', NULL, NULL, NULL, 0, false);
INSERT INTO public."user" (id, "firstName", "lastName", email, password, "profileImagePath", "backgroundImagePath", role, company, "position", education, subscribers, "isPrivateAccount") VALUES (5, 'Adam_1Company', NULL, 'adam1@gmail.com', '$2b$12$aunbDATaffNPA1yUuYOXv.OV0hGECqrpjqVQBeJ0.U0rUn1oYo9aG', NULL, NULL, 'premium', NULL, NULL, NULL, 0, false);
INSERT INTO public."user" (id, "firstName", "lastName", email, password, "profileImagePath", "backgroundImagePath", role, company, "position", education, subscribers, "isPrivateAccount") VALUES (6, 'Adam_2Company', NULL, 'adam2@gmail.com', '$2b$12$bweAm7delqEs6ZHsP/F3r.eYvFhObs.7/HHONhd/oPDsh3Co6akka', NULL, NULL, 'premium', NULL, NULL, NULL, 0, false);
INSERT INTO public."user" (id, "firstName", "lastName", email, password, "profileImagePath", "backgroundImagePath", role, company, "position", education, subscribers, "isPrivateAccount") VALUES (7, 'Adam_3Company', NULL, 'adam3@gmail.com', '$2b$12$NRw3ZVzwK82X9yAZJs6BDOElppsyfFv.BMLZjig0CPGuqX4w6b4Ci', NULL, NULL, 'premium', NULL, NULL, NULL, 0, false);
INSERT INTO public."user" (id, "firstName", "lastName", email, password, "profileImagePath", "backgroundImagePath", role, company, "position", education, subscribers, "isPrivateAccount") VALUES (8, 'FriendCompany', NULL, 'friend@gmail.com', '$2b$12$.r.fuF8awUD.cNMcKBCRHeDumD8vFUgqPHBZ0aCqF2/kKurvNydwu', NULL, NULL, 'premium', NULL, NULL, NULL, 0, false);
INSERT INTO public."user" (id, "firstName", "lastName", email, password, "profileImagePath", "backgroundImagePath", role, company, "position", education, subscribers, "isPrivateAccount") VALUES (9, 'Adam_4Company', NULL, 'Adam4@gmail.com', '$2b$12$MOeATWKGu7LSsXrfsnA.d.Nc0gO8enuf5heJ3CLPDgHsBBh8YPml2', NULL, NULL, 'premium', NULL, NULL, NULL, 0, false);
INSERT INTO public."user" (id, "firstName", "lastName", email, password, "profileImagePath", "backgroundImagePath", role, company, "position", education, subscribers, "isPrivateAccount") VALUES (10, 'Adam_5Company', NULL, 'Adam5@gmail.com', '$2b$12$r9CapaMFQK7mQE8VYzyOn.4hVJnCo9wjGmCBYF5vCRc1u4s5.fZ0m', NULL, NULL, 'premium', NULL, NULL, NULL, 0, false);
INSERT INTO public."user" (id, "firstName", "lastName", email, password, "profileImagePath", "backgroundImagePath", role, company, "position", education, subscribers, "isPrivateAccount") VALUES (11, 'Adam_6Company', NULL, 'Adam6@gmail.com', '$2b$12$FMlWMBeLRG8pIFSb/7nFxennE.KE1bWeZT6yY2eb.B7CUTIu/4SPe', NULL, NULL, 'premium', NULL, NULL, NULL, 0, false);
INSERT INTO public."user" (id, "firstName", "lastName", email, password, "profileImagePath", "backgroundImagePath", role, company, "position", education, subscribers, "isPrivateAccount") VALUES (12, 'Adam_7Company', NULL, 'Adam7@gmail.com', '$2b$12$ZDBrli1VTmsFgTvfs.X77u2si.QgUQVQ7K6woJIMIKf7uYWv86g0e', NULL, NULL, 'premium', NULL, NULL, NULL, 0, false);
INSERT INTO public."user" (id, "firstName", "lastName", email, password, "profileImagePath", "backgroundImagePath", role, company, "position", education, subscribers, "isPrivateAccount") VALUES (13, 'Adam_8Company', NULL, 'Adam8@gmail.com', '$2b$12$3JwRCiBV8UULWdbyByvkL.LPcqamT3Kh4kdfq.XiO3nRI6ZrhgU3m', NULL, NULL, 'premium', NULL, NULL, NULL, 0, false);
INSERT INTO public."user" (id, "firstName", "lastName", email, password, "profileImagePath", "backgroundImagePath", role, company, "position", education, subscribers, "isPrivateAccount") VALUES (14, 'Adam_9Company', NULL, 'Adam9@gmail.com', '$2b$12$Klecj.YkKoox9egDlpSEweqiD7EaFUV7kHH3uHCltfuwzVRfo2XJ.', NULL, NULL, 'premium', NULL, NULL, NULL, 0, false);
INSERT INTO public."user" (id, "firstName", "lastName", email, password, "profileImagePath", "backgroundImagePath", role, company, "position", education, subscribers, "isPrivateAccount") VALUES (15, 'Adam_10Company', NULL, 'Adam10@gmail.com', '$2b$12$kD.hL8E33qyo.FXyUV1Ovuc1zAddZ0Vb.ehpmA6F0Vx9Xvk6sAGaq', NULL, NULL, 'premium', NULL, NULL, NULL, 0, false);
INSERT INTO public."user" (id, "firstName", "lastName", email, password, "profileImagePath", "backgroundImagePath", role, company, "position", education, subscribers, "isPrivateAccount") VALUES (16, 'krakowAccount', NULL, 'krakow@gmail.com', '$2b$12$Ns2OrLkuYcK0k9vwoIbn0eL6iWn8SrZPa4UAAxmLJj1g10Q.ouOy2', '75866789-bb92-4328-b595-5e5d311f4eb9.png', NULL, 'premium', NULL, NULL, NULL, 0, false);
INSERT INTO public."user" (id, "firstName", "lastName", email, password, "profileImagePath", "backgroundImagePath", role, company, "position", education, subscribers, "isPrivateAccount") VALUES (1, 'Premium', 'Account', 'premium@gmail.com', '$2b$12$YQ8EP3wEPP1jF7JSUe.gb.ILL74KEySPVEh/Kgv2kmemz6Bc18lI2', 'eb611517-47aa-4688-8ea1-626279522e6d.png', '74b3284a-26c0-412f-9cb0-ef45eed7dbe1.PNG', 'premium', NULL, NULL, NULL, NULL, true);
INSERT INTO public."user" (id, "firstName", "lastName", email, password, "profileImagePath", "backgroundImagePath", role, company, "position", education, subscribers, "isPrivateAccount") VALUES (17, 'Adam_11Company', NULL, 'Adam11@gmail.com', '$2b$12$mUJNqMV6QsVU7Wjc29ceKeycUGFpMMlwD3Iz7gIccS7kaGbWnADWG', NULL, NULL, 'premium', NULL, NULL, NULL, 0, false);
INSERT INTO public."user" (id, "firstName", "lastName", email, password, "profileImagePath", "backgroundImagePath", role, company, "position", education, subscribers, "isPrivateAccount") VALUES (18, 'Ewelina', 'Zeszyt', 'eweline@gmail.com', '$2b$12$k5jQG6aiXZFbtbQkfLcbtuSDnjuph3RVPZMnEVGupfOsbz2jakJO.', 'b6f30a98-54b6-481d-a684-06cec277a51d.JPG', NULL, 'premium', NULL, NULL, NULL, NULL, true);
INSERT INTO public."user" (id, "firstName", "lastName", email, password, "profileImagePath", "backgroundImagePath", role, company, "position", education, subscribers, "isPrivateAccount") VALUES (3, 'TestAccount', NULL, 'test@gmail.com', '$2b$12$mTqFRVfts2J58NNNTpo65egluAWG0LhpbM3bnE.ceHB2ttcg40D9u', '8e1bd848-cd4a-44af-8ffa-c7165d899336.JPG', '1ed6f41f-0184-439f-a31f-52801e31dc38.PNG', 'premium', NULL, NULL, NULL, 0, false);
INSERT INTO public."user" (id, "firstName", "lastName", email, password, "profileImagePath", "backgroundImagePath", role, company, "position", education, subscribers, "isPrivateAccount") VALUES (2, 'User', 'Account', 'user@gmail.com', '$2b$12$UQ2m6KqKWJ53YD5qLxCkg.hnlERV2AqAaJWf6AeQN4HqBjWFz9D7m', '50c03967-44e0-4b5e-a7c1-92da75c8f449.JPG', '7c3a408d-54ce-4246-9eae-1f873f156901.PNG', 'premium', NULL, NULL, NULL, NULL, true);


--
-- TOC entry 3338 (class 0 OID 0)
-- Dependencies: 216
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 18, true);


--
-- TOC entry 3185 (class 2606 OID 16597)
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- TOC entry 3187 (class 2606 OID 16599)
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


-- Completed on 2023-06-28 16:07:06

--
-- PostgreSQL database dump complete
--

