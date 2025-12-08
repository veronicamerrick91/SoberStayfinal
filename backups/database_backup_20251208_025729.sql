--
-- PostgreSQL database dump
--

\restrict ioH1CJQbJJaRjwC02Cskx42cvaaI4SNsFG0LNmuiqGk9AgeAZ03De3twpJ3YYbO

-- Dumped from database version 16.11 (b740647)
-- Dumped by pg_dump version 16.10

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

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO neondb_owner;

--
-- Name: stripe; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

CREATE SCHEMA stripe;


ALTER SCHEMA stripe OWNER TO neondb_owner;

--
-- Name: invoice_status; Type: TYPE; Schema: stripe; Owner: neondb_owner
--

CREATE TYPE stripe.invoice_status AS ENUM (
    'draft',
    'open',
    'paid',
    'uncollectible',
    'void',
    'deleted'
);


ALTER TYPE stripe.invoice_status OWNER TO neondb_owner;

--
-- Name: pricing_tiers; Type: TYPE; Schema: stripe; Owner: neondb_owner
--

CREATE TYPE stripe.pricing_tiers AS ENUM (
    'graduated',
    'volume'
);


ALTER TYPE stripe.pricing_tiers OWNER TO neondb_owner;

--
-- Name: pricing_type; Type: TYPE; Schema: stripe; Owner: neondb_owner
--

CREATE TYPE stripe.pricing_type AS ENUM (
    'one_time',
    'recurring'
);


ALTER TYPE stripe.pricing_type OWNER TO neondb_owner;

--
-- Name: subscription_schedule_status; Type: TYPE; Schema: stripe; Owner: neondb_owner
--

CREATE TYPE stripe.subscription_schedule_status AS ENUM (
    'not_started',
    'active',
    'completed',
    'released',
    'canceled'
);


ALTER TYPE stripe.subscription_schedule_status OWNER TO neondb_owner;

--
-- Name: subscription_status; Type: TYPE; Schema: stripe; Owner: neondb_owner
--

CREATE TYPE stripe.subscription_status AS ENUM (
    'trialing',
    'active',
    'canceled',
    'incomplete',
    'incomplete_expired',
    'past_due',
    'unpaid',
    'paused'
);


ALTER TYPE stripe.subscription_status OWNER TO neondb_owner;

--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  new._updated_at = now();
  return NEW;
end;
$$;


ALTER FUNCTION public.set_updated_at() OWNER TO neondb_owner;

--
-- Name: set_updated_at_metadata(); Type: FUNCTION; Schema: public; Owner: neondb_owner
--

CREATE FUNCTION public.set_updated_at_metadata() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
  new.updated_at = now();
  return NEW;
end;
$$;


ALTER FUNCTION public.set_updated_at_metadata() OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: neondb_owner
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO neondb_owner;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: neondb_owner
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNER TO neondb_owner;

--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: neondb_owner
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: applications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.applications (
    id integer NOT NULL,
    tenant_id integer NOT NULL,
    listing_id integer NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    data jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.applications OWNER TO neondb_owner;

--
-- Name: applications_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applications_id_seq OWNER TO neondb_owner;

--
-- Name: applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.applications_id_seq OWNED BY public.applications.id;


--
-- Name: listings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.listings (
    id integer NOT NULL,
    provider_id integer NOT NULL,
    property_name text NOT NULL,
    address text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    monthly_price integer NOT NULL,
    total_beds integer NOT NULL,
    gender text NOT NULL,
    room_type text NOT NULL,
    description text NOT NULL,
    amenities jsonb NOT NULL,
    inclusions jsonb NOT NULL,
    photos jsonb NOT NULL,
    supervision_type text NOT NULL,
    is_mat_friendly boolean DEFAULT false NOT NULL,
    is_pet_friendly boolean DEFAULT false NOT NULL,
    is_lgbtq_friendly boolean DEFAULT false NOT NULL,
    is_faith_based boolean DEFAULT false NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.listings OWNER TO neondb_owner;

--
-- Name: listings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.listings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.listings_id_seq OWNER TO neondb_owner;

--
-- Name: listings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.listings_id_seq OWNED BY public.listings.id;


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.password_reset_tokens (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    used_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.password_reset_tokens OWNER TO neondb_owner;

--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.password_reset_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.password_reset_tokens_id_seq OWNER TO neondb_owner;

--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.password_reset_tokens_id_seq OWNED BY public.password_reset_tokens.id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO neondb_owner;

--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.subscriptions (
    id integer NOT NULL,
    provider_id integer NOT NULL,
    status text NOT NULL,
    current_period_end timestamp without time zone NOT NULL,
    payment_method text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.subscriptions OWNER TO neondb_owner;

--
-- Name: subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subscriptions_id_seq OWNER TO neondb_owner;

--
-- Name: subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.subscriptions_id_seq OWNED BY public.subscriptions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    role text DEFAULT 'tenant'::text NOT NULL,
    stripe_customer_id text,
    stripe_subscription_id text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    google_id text
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: _managed_webhooks; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe._managed_webhooks (
    id text NOT NULL,
    object text,
    uuid text NOT NULL,
    url text NOT NULL,
    enabled_events jsonb NOT NULL,
    description text,
    enabled boolean,
    livemode boolean,
    metadata jsonb,
    secret text NOT NULL,
    status text,
    api_version text,
    created integer,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_synced_at timestamp with time zone,
    account_id text NOT NULL
);


ALTER TABLE stripe._managed_webhooks OWNER TO neondb_owner;

--
-- Name: _migrations; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe._migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE stripe._migrations OWNER TO neondb_owner;

--
-- Name: _sync_status; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe._sync_status (
    id integer NOT NULL,
    resource text NOT NULL,
    status text DEFAULT 'idle'::text,
    last_synced_at timestamp with time zone DEFAULT now(),
    last_incremental_cursor timestamp with time zone,
    error_message text,
    updated_at timestamp with time zone DEFAULT now(),
    account_id text NOT NULL,
    CONSTRAINT _sync_status_status_check CHECK ((status = ANY (ARRAY['idle'::text, 'running'::text, 'complete'::text, 'error'::text])))
);


ALTER TABLE stripe._sync_status OWNER TO neondb_owner;

--
-- Name: _sync_status_id_seq; Type: SEQUENCE; Schema: stripe; Owner: neondb_owner
--

CREATE SEQUENCE stripe._sync_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE stripe._sync_status_id_seq OWNER TO neondb_owner;

--
-- Name: _sync_status_id_seq; Type: SEQUENCE OWNED BY; Schema: stripe; Owner: neondb_owner
--

ALTER SEQUENCE stripe._sync_status_id_seq OWNED BY stripe._sync_status.id;


--
-- Name: accounts; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe.accounts (
    _raw_data jsonb NOT NULL,
    first_synced_at timestamp with time zone DEFAULT now() NOT NULL,
    _last_synced_at timestamp with time zone DEFAULT now() NOT NULL,
    _updated_at timestamp with time zone DEFAULT now() NOT NULL,
    business_name text GENERATED ALWAYS AS (((_raw_data -> 'business_profile'::text) ->> 'name'::text)) STORED,
    email text GENERATED ALWAYS AS ((_raw_data ->> 'email'::text)) STORED,
    type text GENERATED ALWAYS AS ((_raw_data ->> 'type'::text)) STORED,
    charges_enabled boolean GENERATED ALWAYS AS (((_raw_data ->> 'charges_enabled'::text))::boolean) STORED,
    payouts_enabled boolean GENERATED ALWAYS AS (((_raw_data ->> 'payouts_enabled'::text))::boolean) STORED,
    details_submitted boolean GENERATED ALWAYS AS (((_raw_data ->> 'details_submitted'::text))::boolean) STORED,
    country text GENERATED ALWAYS AS ((_raw_data ->> 'country'::text)) STORED,
    default_currency text GENERATED ALWAYS AS ((_raw_data ->> 'default_currency'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    api_key_hashes text[] DEFAULT '{}'::text[],
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.accounts OWNER TO neondb_owner;

--
-- Name: active_entitlements; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe.active_entitlements (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    feature text GENERATED ALWAYS AS ((_raw_data ->> 'feature'::text)) STORED,
    customer text GENERATED ALWAYS AS ((_raw_data ->> 'customer'::text)) STORED,
    lookup_key text GENERATED ALWAYS AS ((_raw_data ->> 'lookup_key'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.active_entitlements OWNER TO neondb_owner;

--
-- Name: charges; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe.charges (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    paid boolean GENERATED ALWAYS AS (((_raw_data ->> 'paid'::text))::boolean) STORED,
    "order" text GENERATED ALWAYS AS ((_raw_data ->> 'order'::text)) STORED,
    amount bigint GENERATED ALWAYS AS (((_raw_data ->> 'amount'::text))::bigint) STORED,
    review text GENERATED ALWAYS AS ((_raw_data ->> 'review'::text)) STORED,
    source jsonb GENERATED ALWAYS AS ((_raw_data -> 'source'::text)) STORED,
    status text GENERATED ALWAYS AS ((_raw_data ->> 'status'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    dispute text GENERATED ALWAYS AS ((_raw_data ->> 'dispute'::text)) STORED,
    invoice text GENERATED ALWAYS AS ((_raw_data ->> 'invoice'::text)) STORED,
    outcome jsonb GENERATED ALWAYS AS ((_raw_data -> 'outcome'::text)) STORED,
    refunds jsonb GENERATED ALWAYS AS ((_raw_data -> 'refunds'::text)) STORED,
    updated integer GENERATED ALWAYS AS (((_raw_data ->> 'updated'::text))::integer) STORED,
    captured boolean GENERATED ALWAYS AS (((_raw_data ->> 'captured'::text))::boolean) STORED,
    currency text GENERATED ALWAYS AS ((_raw_data ->> 'currency'::text)) STORED,
    customer text GENERATED ALWAYS AS ((_raw_data ->> 'customer'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    refunded boolean GENERATED ALWAYS AS (((_raw_data ->> 'refunded'::text))::boolean) STORED,
    shipping jsonb GENERATED ALWAYS AS ((_raw_data -> 'shipping'::text)) STORED,
    application text GENERATED ALWAYS AS ((_raw_data ->> 'application'::text)) STORED,
    description text GENERATED ALWAYS AS ((_raw_data ->> 'description'::text)) STORED,
    destination text GENERATED ALWAYS AS ((_raw_data ->> 'destination'::text)) STORED,
    failure_code text GENERATED ALWAYS AS ((_raw_data ->> 'failure_code'::text)) STORED,
    on_behalf_of text GENERATED ALWAYS AS ((_raw_data ->> 'on_behalf_of'::text)) STORED,
    fraud_details jsonb GENERATED ALWAYS AS ((_raw_data -> 'fraud_details'::text)) STORED,
    receipt_email text GENERATED ALWAYS AS ((_raw_data ->> 'receipt_email'::text)) STORED,
    payment_intent text GENERATED ALWAYS AS ((_raw_data ->> 'payment_intent'::text)) STORED,
    receipt_number text GENERATED ALWAYS AS ((_raw_data ->> 'receipt_number'::text)) STORED,
    transfer_group text GENERATED ALWAYS AS ((_raw_data ->> 'transfer_group'::text)) STORED,
    amount_refunded bigint GENERATED ALWAYS AS (((_raw_data ->> 'amount_refunded'::text))::bigint) STORED,
    application_fee text GENERATED ALWAYS AS ((_raw_data ->> 'application_fee'::text)) STORED,
    failure_message text GENERATED ALWAYS AS ((_raw_data ->> 'failure_message'::text)) STORED,
    source_transfer text GENERATED ALWAYS AS ((_raw_data ->> 'source_transfer'::text)) STORED,
    balance_transaction text GENERATED ALWAYS AS ((_raw_data ->> 'balance_transaction'::text)) STORED,
    statement_descriptor text GENERATED ALWAYS AS ((_raw_data ->> 'statement_descriptor'::text)) STORED,
    payment_method_details jsonb GENERATED ALWAYS AS ((_raw_data -> 'payment_method_details'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.charges OWNER TO neondb_owner;

--
-- Name: checkout_session_line_items; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe.checkout_session_line_items (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    amount_discount integer GENERATED ALWAYS AS (((_raw_data ->> 'amount_discount'::text))::integer) STORED,
    amount_subtotal integer GENERATED ALWAYS AS (((_raw_data ->> 'amount_subtotal'::text))::integer) STORED,
    amount_tax integer GENERATED ALWAYS AS (((_raw_data ->> 'amount_tax'::text))::integer) STORED,
    amount_total integer GENERATED ALWAYS AS (((_raw_data ->> 'amount_total'::text))::integer) STORED,
    currency text GENERATED ALWAYS AS ((_raw_data ->> 'currency'::text)) STORED,
    description text GENERATED ALWAYS AS ((_raw_data ->> 'description'::text)) STORED,
    price text GENERATED ALWAYS AS ((_raw_data ->> 'price'::text)) STORED,
    quantity integer GENERATED ALWAYS AS (((_raw_data ->> 'quantity'::text))::integer) STORED,
    checkout_session text GENERATED ALWAYS AS ((_raw_data ->> 'checkout_session'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.checkout_session_line_items OWNER TO neondb_owner;

--
-- Name: checkout_sessions; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe.checkout_sessions (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    adaptive_pricing jsonb GENERATED ALWAYS AS ((_raw_data -> 'adaptive_pricing'::text)) STORED,
    after_expiration jsonb GENERATED ALWAYS AS ((_raw_data -> 'after_expiration'::text)) STORED,
    allow_promotion_codes boolean GENERATED ALWAYS AS (((_raw_data ->> 'allow_promotion_codes'::text))::boolean) STORED,
    amount_subtotal integer GENERATED ALWAYS AS (((_raw_data ->> 'amount_subtotal'::text))::integer) STORED,
    amount_total integer GENERATED ALWAYS AS (((_raw_data ->> 'amount_total'::text))::integer) STORED,
    automatic_tax jsonb GENERATED ALWAYS AS ((_raw_data -> 'automatic_tax'::text)) STORED,
    billing_address_collection text GENERATED ALWAYS AS ((_raw_data ->> 'billing_address_collection'::text)) STORED,
    cancel_url text GENERATED ALWAYS AS ((_raw_data ->> 'cancel_url'::text)) STORED,
    client_reference_id text GENERATED ALWAYS AS ((_raw_data ->> 'client_reference_id'::text)) STORED,
    client_secret text GENERATED ALWAYS AS ((_raw_data ->> 'client_secret'::text)) STORED,
    collected_information jsonb GENERATED ALWAYS AS ((_raw_data -> 'collected_information'::text)) STORED,
    consent jsonb GENERATED ALWAYS AS ((_raw_data -> 'consent'::text)) STORED,
    consent_collection jsonb GENERATED ALWAYS AS ((_raw_data -> 'consent_collection'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    currency text GENERATED ALWAYS AS ((_raw_data ->> 'currency'::text)) STORED,
    currency_conversion jsonb GENERATED ALWAYS AS ((_raw_data -> 'currency_conversion'::text)) STORED,
    custom_fields jsonb GENERATED ALWAYS AS ((_raw_data -> 'custom_fields'::text)) STORED,
    custom_text jsonb GENERATED ALWAYS AS ((_raw_data -> 'custom_text'::text)) STORED,
    customer text GENERATED ALWAYS AS ((_raw_data ->> 'customer'::text)) STORED,
    customer_creation text GENERATED ALWAYS AS ((_raw_data ->> 'customer_creation'::text)) STORED,
    customer_details jsonb GENERATED ALWAYS AS ((_raw_data -> 'customer_details'::text)) STORED,
    customer_email text GENERATED ALWAYS AS ((_raw_data ->> 'customer_email'::text)) STORED,
    discounts jsonb GENERATED ALWAYS AS ((_raw_data -> 'discounts'::text)) STORED,
    expires_at integer GENERATED ALWAYS AS (((_raw_data ->> 'expires_at'::text))::integer) STORED,
    invoice text GENERATED ALWAYS AS ((_raw_data ->> 'invoice'::text)) STORED,
    invoice_creation jsonb GENERATED ALWAYS AS ((_raw_data -> 'invoice_creation'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    locale text GENERATED ALWAYS AS ((_raw_data ->> 'locale'::text)) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    mode text GENERATED ALWAYS AS ((_raw_data ->> 'mode'::text)) STORED,
    optional_items jsonb GENERATED ALWAYS AS ((_raw_data -> 'optional_items'::text)) STORED,
    payment_intent text GENERATED ALWAYS AS ((_raw_data ->> 'payment_intent'::text)) STORED,
    payment_link text GENERATED ALWAYS AS ((_raw_data ->> 'payment_link'::text)) STORED,
    payment_method_collection text GENERATED ALWAYS AS ((_raw_data ->> 'payment_method_collection'::text)) STORED,
    payment_method_configuration_details jsonb GENERATED ALWAYS AS ((_raw_data -> 'payment_method_configuration_details'::text)) STORED,
    payment_method_options jsonb GENERATED ALWAYS AS ((_raw_data -> 'payment_method_options'::text)) STORED,
    payment_method_types jsonb GENERATED ALWAYS AS ((_raw_data -> 'payment_method_types'::text)) STORED,
    payment_status text GENERATED ALWAYS AS ((_raw_data ->> 'payment_status'::text)) STORED,
    permissions jsonb GENERATED ALWAYS AS ((_raw_data -> 'permissions'::text)) STORED,
    phone_number_collection jsonb GENERATED ALWAYS AS ((_raw_data -> 'phone_number_collection'::text)) STORED,
    presentment_details jsonb GENERATED ALWAYS AS ((_raw_data -> 'presentment_details'::text)) STORED,
    recovered_from text GENERATED ALWAYS AS ((_raw_data ->> 'recovered_from'::text)) STORED,
    redirect_on_completion text GENERATED ALWAYS AS ((_raw_data ->> 'redirect_on_completion'::text)) STORED,
    return_url text GENERATED ALWAYS AS ((_raw_data ->> 'return_url'::text)) STORED,
    saved_payment_method_options jsonb GENERATED ALWAYS AS ((_raw_data -> 'saved_payment_method_options'::text)) STORED,
    setup_intent text GENERATED ALWAYS AS ((_raw_data ->> 'setup_intent'::text)) STORED,
    shipping_address_collection jsonb GENERATED ALWAYS AS ((_raw_data -> 'shipping_address_collection'::text)) STORED,
    shipping_cost jsonb GENERATED ALWAYS AS ((_raw_data -> 'shipping_cost'::text)) STORED,
    shipping_details jsonb GENERATED ALWAYS AS ((_raw_data -> 'shipping_details'::text)) STORED,
    shipping_options jsonb GENERATED ALWAYS AS ((_raw_data -> 'shipping_options'::text)) STORED,
    status text GENERATED ALWAYS AS ((_raw_data ->> 'status'::text)) STORED,
    submit_type text GENERATED ALWAYS AS ((_raw_data ->> 'submit_type'::text)) STORED,
    subscription text GENERATED ALWAYS AS ((_raw_data ->> 'subscription'::text)) STORED,
    success_url text GENERATED ALWAYS AS ((_raw_data ->> 'success_url'::text)) STORED,
    tax_id_collection jsonb GENERATED ALWAYS AS ((_raw_data -> 'tax_id_collection'::text)) STORED,
    total_details jsonb GENERATED ALWAYS AS ((_raw_data -> 'total_details'::text)) STORED,
    ui_mode text GENERATED ALWAYS AS ((_raw_data ->> 'ui_mode'::text)) STORED,
    url text GENERATED ALWAYS AS ((_raw_data ->> 'url'::text)) STORED,
    wallet_options jsonb GENERATED ALWAYS AS ((_raw_data -> 'wallet_options'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.checkout_sessions OWNER TO neondb_owner;

--
-- Name: coupons; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe.coupons (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    name text GENERATED ALWAYS AS ((_raw_data ->> 'name'::text)) STORED,
    valid boolean GENERATED ALWAYS AS (((_raw_data ->> 'valid'::text))::boolean) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    updated integer GENERATED ALWAYS AS (((_raw_data ->> 'updated'::text))::integer) STORED,
    currency text GENERATED ALWAYS AS ((_raw_data ->> 'currency'::text)) STORED,
    duration text GENERATED ALWAYS AS ((_raw_data ->> 'duration'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    redeem_by integer GENERATED ALWAYS AS (((_raw_data ->> 'redeem_by'::text))::integer) STORED,
    amount_off bigint GENERATED ALWAYS AS (((_raw_data ->> 'amount_off'::text))::bigint) STORED,
    percent_off double precision GENERATED ALWAYS AS (((_raw_data ->> 'percent_off'::text))::double precision) STORED,
    times_redeemed bigint GENERATED ALWAYS AS (((_raw_data ->> 'times_redeemed'::text))::bigint) STORED,
    max_redemptions bigint GENERATED ALWAYS AS (((_raw_data ->> 'max_redemptions'::text))::bigint) STORED,
    duration_in_months bigint GENERATED ALWAYS AS (((_raw_data ->> 'duration_in_months'::text))::bigint) STORED,
    percent_off_precise double precision GENERATED ALWAYS AS (((_raw_data ->> 'percent_off_precise'::text))::double precision) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.coupons OWNER TO neondb_owner;

--
-- Name: credit_notes; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe.credit_notes (
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    amount integer GENERATED ALWAYS AS (((_raw_data ->> 'amount'::text))::integer) STORED,
    amount_shipping integer GENERATED ALWAYS AS (((_raw_data ->> 'amount_shipping'::text))::integer) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    currency text GENERATED ALWAYS AS ((_raw_data ->> 'currency'::text)) STORED,
    customer text GENERATED ALWAYS AS ((_raw_data ->> 'customer'::text)) STORED,
    customer_balance_transaction text GENERATED ALWAYS AS ((_raw_data ->> 'customer_balance_transaction'::text)) STORED,
    discount_amount integer GENERATED ALWAYS AS (((_raw_data ->> 'discount_amount'::text))::integer) STORED,
    discount_amounts jsonb GENERATED ALWAYS AS ((_raw_data -> 'discount_amounts'::text)) STORED,
    invoice text GENERATED ALWAYS AS ((_raw_data ->> 'invoice'::text)) STORED,
    lines jsonb GENERATED ALWAYS AS ((_raw_data -> 'lines'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    memo text GENERATED ALWAYS AS ((_raw_data ->> 'memo'::text)) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    number text GENERATED ALWAYS AS ((_raw_data ->> 'number'::text)) STORED,
    out_of_band_amount integer GENERATED ALWAYS AS (((_raw_data ->> 'out_of_band_amount'::text))::integer) STORED,
    pdf text GENERATED ALWAYS AS ((_raw_data ->> 'pdf'::text)) STORED,
    reason text GENERATED ALWAYS AS ((_raw_data ->> 'reason'::text)) STORED,
    refund text GENERATED ALWAYS AS ((_raw_data ->> 'refund'::text)) STORED,
    shipping_cost jsonb GENERATED ALWAYS AS ((_raw_data -> 'shipping_cost'::text)) STORED,
    status text GENERATED ALWAYS AS ((_raw_data ->> 'status'::text)) STORED,
    subtotal integer GENERATED ALWAYS AS (((_raw_data ->> 'subtotal'::text))::integer) STORED,
    subtotal_excluding_tax integer GENERATED ALWAYS AS (((_raw_data ->> 'subtotal_excluding_tax'::text))::integer) STORED,
    tax_amounts jsonb GENERATED ALWAYS AS ((_raw_data -> 'tax_amounts'::text)) STORED,
    total integer GENERATED ALWAYS AS (((_raw_data ->> 'total'::text))::integer) STORED,
    total_excluding_tax integer GENERATED ALWAYS AS (((_raw_data ->> 'total_excluding_tax'::text))::integer) STORED,
    type text GENERATED ALWAYS AS ((_raw_data ->> 'type'::text)) STORED,
    voided_at text GENERATED ALWAYS AS ((_raw_data ->> 'voided_at'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.credit_notes OWNER TO neondb_owner;

--
-- Name: customers; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe.customers (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    address jsonb GENERATED ALWAYS AS ((_raw_data -> 'address'::text)) STORED,
    description text GENERATED ALWAYS AS ((_raw_data ->> 'description'::text)) STORED,
    email text GENERATED ALWAYS AS ((_raw_data ->> 'email'::text)) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    name text GENERATED ALWAYS AS ((_raw_data ->> 'name'::text)) STORED,
    phone text GENERATED ALWAYS AS ((_raw_data ->> 'phone'::text)) STORED,
    shipping jsonb GENERATED ALWAYS AS ((_raw_data -> 'shipping'::text)) STORED,
    balance integer GENERATED ALWAYS AS (((_raw_data ->> 'balance'::text))::integer) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    currency text GENERATED ALWAYS AS ((_raw_data ->> 'currency'::text)) STORED,
    default_source text GENERATED ALWAYS AS ((_raw_data ->> 'default_source'::text)) STORED,
    delinquent boolean GENERATED ALWAYS AS (((_raw_data ->> 'delinquent'::text))::boolean) STORED,
    discount jsonb GENERATED ALWAYS AS ((_raw_data -> 'discount'::text)) STORED,
    invoice_prefix text GENERATED ALWAYS AS ((_raw_data ->> 'invoice_prefix'::text)) STORED,
    invoice_settings jsonb GENERATED ALWAYS AS ((_raw_data -> 'invoice_settings'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    next_invoice_sequence integer GENERATED ALWAYS AS (((_raw_data ->> 'next_invoice_sequence'::text))::integer) STORED,
    preferred_locales jsonb GENERATED ALWAYS AS ((_raw_data -> 'preferred_locales'::text)) STORED,
    tax_exempt text GENERATED ALWAYS AS ((_raw_data ->> 'tax_exempt'::text)) STORED,
    deleted boolean GENERATED ALWAYS AS (((_raw_data ->> 'deleted'::text))::boolean) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.customers OWNER TO neondb_owner;

--
-- Name: disputes; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe.disputes (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    amount bigint GENERATED ALWAYS AS (((_raw_data ->> 'amount'::text))::bigint) STORED,
    charge text GENERATED ALWAYS AS ((_raw_data ->> 'charge'::text)) STORED,
    reason text GENERATED ALWAYS AS ((_raw_data ->> 'reason'::text)) STORED,
    status text GENERATED ALWAYS AS ((_raw_data ->> 'status'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    updated integer GENERATED ALWAYS AS (((_raw_data ->> 'updated'::text))::integer) STORED,
    currency text GENERATED ALWAYS AS ((_raw_data ->> 'currency'::text)) STORED,
    evidence jsonb GENERATED ALWAYS AS ((_raw_data -> 'evidence'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    evidence_details jsonb GENERATED ALWAYS AS ((_raw_data -> 'evidence_details'::text)) STORED,
    balance_transactions jsonb GENERATED ALWAYS AS ((_raw_data -> 'balance_transactions'::text)) STORED,
    is_charge_refundable boolean GENERATED ALWAYS AS (((_raw_data ->> 'is_charge_refundable'::text))::boolean) STORED,
    payment_intent text GENERATED ALWAYS AS ((_raw_data ->> 'payment_intent'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.disputes OWNER TO neondb_owner;

--
-- Name: early_fraud_warnings; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe.early_fraud_warnings (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    actionable boolean GENERATED ALWAYS AS (((_raw_data ->> 'actionable'::text))::boolean) STORED,
    charge text GENERATED ALWAYS AS ((_raw_data ->> 'charge'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    fraud_type text GENERATED ALWAYS AS ((_raw_data ->> 'fraud_type'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    payment_intent text GENERATED ALWAYS AS ((_raw_data ->> 'payment_intent'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.early_fraud_warnings OWNER TO neondb_owner;

--
-- Name: events; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe.events (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    data jsonb GENERATED ALWAYS AS ((_raw_data -> 'data'::text)) STORED,
    type text GENERATED ALWAYS AS ((_raw_data ->> 'type'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    request text GENERATED ALWAYS AS ((_raw_data ->> 'request'::text)) STORED,
    updated integer GENERATED ALWAYS AS (((_raw_data ->> 'updated'::text))::integer) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    api_version text GENERATED ALWAYS AS ((_raw_data ->> 'api_version'::text)) STORED,
    pending_webhooks bigint GENERATED ALWAYS AS (((_raw_data ->> 'pending_webhooks'::text))::bigint) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.events OWNER TO neondb_owner;

--
-- Name: features; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe.features (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    name text GENERATED ALWAYS AS ((_raw_data ->> 'name'::text)) STORED,
    lookup_key text GENERATED ALWAYS AS ((_raw_data ->> 'lookup_key'::text)) STORED,
    active boolean GENERATED ALWAYS AS (((_raw_data ->> 'active'::text))::boolean) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.features OWNER TO neondb_owner;

--
-- Name: invoices; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe.invoices (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    auto_advance boolean GENERATED ALWAYS AS (((_raw_data ->> 'auto_advance'::text))::boolean) STORED,
    collection_method text GENERATED ALWAYS AS ((_raw_data ->> 'collection_method'::text)) STORED,
    currency text GENERATED ALWAYS AS ((_raw_data ->> 'currency'::text)) STORED,
    description text GENERATED ALWAYS AS ((_raw_data ->> 'description'::text)) STORED,
    hosted_invoice_url text GENERATED ALWAYS AS ((_raw_data ->> 'hosted_invoice_url'::text)) STORED,
    lines jsonb GENERATED ALWAYS AS ((_raw_data -> 'lines'::text)) STORED,
    period_end integer GENERATED ALWAYS AS (((_raw_data ->> 'period_end'::text))::integer) STORED,
    period_start integer GENERATED ALWAYS AS (((_raw_data ->> 'period_start'::text))::integer) STORED,
    status text GENERATED ALWAYS AS ((_raw_data ->> 'status'::text)) STORED,
    total bigint GENERATED ALWAYS AS (((_raw_data ->> 'total'::text))::bigint) STORED,
    account_country text GENERATED ALWAYS AS ((_raw_data ->> 'account_country'::text)) STORED,
    account_name text GENERATED ALWAYS AS ((_raw_data ->> 'account_name'::text)) STORED,
    account_tax_ids jsonb GENERATED ALWAYS AS ((_raw_data -> 'account_tax_ids'::text)) STORED,
    amount_due bigint GENERATED ALWAYS AS (((_raw_data ->> 'amount_due'::text))::bigint) STORED,
    amount_paid bigint GENERATED ALWAYS AS (((_raw_data ->> 'amount_paid'::text))::bigint) STORED,
    amount_remaining bigint GENERATED ALWAYS AS (((_raw_data ->> 'amount_remaining'::text))::bigint) STORED,
    application_fee_amount bigint GENERATED ALWAYS AS (((_raw_data ->> 'application_fee_amount'::text))::bigint) STORED,
    attempt_count integer GENERATED ALWAYS AS (((_raw_data ->> 'attempt_count'::text))::integer) STORED,
    attempted boolean GENERATED ALWAYS AS (((_raw_data ->> 'attempted'::text))::boolean) STORED,
    billing_reason text GENERATED ALWAYS AS ((_raw_data ->> 'billing_reason'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    custom_fields jsonb GENERATED ALWAYS AS ((_raw_data -> 'custom_fields'::text)) STORED,
    customer_address jsonb GENERATED ALWAYS AS ((_raw_data -> 'customer_address'::text)) STORED,
    customer_email text GENERATED ALWAYS AS ((_raw_data ->> 'customer_email'::text)) STORED,
    customer_name text GENERATED ALWAYS AS ((_raw_data ->> 'customer_name'::text)) STORED,
    customer_phone text GENERATED ALWAYS AS ((_raw_data ->> 'customer_phone'::text)) STORED,
    customer_shipping jsonb GENERATED ALWAYS AS ((_raw_data -> 'customer_shipping'::text)) STORED,
    customer_tax_exempt text GENERATED ALWAYS AS ((_raw_data ->> 'customer_tax_exempt'::text)) STORED,
    customer_tax_ids jsonb GENERATED ALWAYS AS ((_raw_data -> 'customer_tax_ids'::text)) STORED,
    default_tax_rates jsonb GENERATED ALWAYS AS ((_raw_data -> 'default_tax_rates'::text)) STORED,
    discount jsonb GENERATED ALWAYS AS ((_raw_data -> 'discount'::text)) STORED,
    discounts jsonb GENERATED ALWAYS AS ((_raw_data -> 'discounts'::text)) STORED,
    due_date integer GENERATED ALWAYS AS (((_raw_data ->> 'due_date'::text))::integer) STORED,
    ending_balance integer GENERATED ALWAYS AS (((_raw_data ->> 'ending_balance'::text))::integer) STORED,
    footer text GENERATED ALWAYS AS ((_raw_data ->> 'footer'::text)) STORED,
    invoice_pdf text GENERATED ALWAYS AS ((_raw_data ->> 'invoice_pdf'::text)) STORED,
    last_finalization_error jsonb GENERATED ALWAYS AS ((_raw_data -> 'last_finalization_error'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    next_payment_attempt integer GENERATED ALWAYS AS (((_raw_data ->> 'next_payment_attempt'::text))::integer) STORED,
    number text GENERATED ALWAYS AS ((_raw_data ->> 'number'::text)) STORED,
    paid boolean GENERATED ALWAYS AS (((_raw_data ->> 'paid'::text))::boolean) STORED,
    payment_settings jsonb GENERATED ALWAYS AS ((_raw_data -> 'payment_settings'::text)) STORED,
    post_payment_credit_notes_amount integer GENERATED ALWAYS AS (((_raw_data ->> 'post_payment_credit_notes_amount'::text))::integer) STORED,
    pre_payment_credit_notes_amount integer GENERATED ALWAYS AS (((_raw_data ->> 'pre_payment_credit_notes_amount'::text))::integer) STORED,
    receipt_number text GENERATED ALWAYS AS ((_raw_data ->> 'receipt_number'::text)) STORED,
    starting_balance integer GENERATED ALWAYS AS (((_raw_data ->> 'starting_balance'::text))::integer) STORED,
    statement_descriptor text GENERATED ALWAYS AS ((_raw_data ->> 'statement_descriptor'::text)) STORED,
    status_transitions jsonb GENERATED ALWAYS AS ((_raw_data -> 'status_transitions'::text)) STORED,
    subtotal integer GENERATED ALWAYS AS (((_raw_data ->> 'subtotal'::text))::integer) STORED,
    tax integer GENERATED ALWAYS AS (((_raw_data ->> 'tax'::text))::integer) STORED,
    total_discount_amounts jsonb GENERATED ALWAYS AS ((_raw_data -> 'total_discount_amounts'::text)) STORED,
    total_tax_amounts jsonb GENERATED ALWAYS AS ((_raw_data -> 'total_tax_amounts'::text)) STORED,
    transfer_data jsonb GENERATED ALWAYS AS ((_raw_data -> 'transfer_data'::text)) STORED,
    webhooks_delivered_at integer GENERATED ALWAYS AS (((_raw_data ->> 'webhooks_delivered_at'::text))::integer) STORED,
    customer text GENERATED ALWAYS AS ((_raw_data ->> 'customer'::text)) STORED,
    subscription text GENERATED ALWAYS AS ((_raw_data ->> 'subscription'::text)) STORED,
    payment_intent text GENERATED ALWAYS AS ((_raw_data ->> 'payment_intent'::text)) STORED,
    default_payment_method text GENERATED ALWAYS AS ((_raw_data ->> 'default_payment_method'::text)) STORED,
    default_source text GENERATED ALWAYS AS ((_raw_data ->> 'default_source'::text)) STORED,
    on_behalf_of text GENERATED ALWAYS AS ((_raw_data ->> 'on_behalf_of'::text)) STORED,
    charge text GENERATED ALWAYS AS ((_raw_data ->> 'charge'::text)) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.invoices OWNER TO neondb_owner;

--
-- Name: payment_intents; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe.payment_intents (
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    amount integer GENERATED ALWAYS AS (((_raw_data ->> 'amount'::text))::integer) STORED,
    amount_capturable integer GENERATED ALWAYS AS (((_raw_data ->> 'amount_capturable'::text))::integer) STORED,
    amount_details jsonb GENERATED ALWAYS AS ((_raw_data -> 'amount_details'::text)) STORED,
    amount_received integer GENERATED ALWAYS AS (((_raw_data ->> 'amount_received'::text))::integer) STORED,
    application text GENERATED ALWAYS AS ((_raw_data ->> 'application'::text)) STORED,
    application_fee_amount integer GENERATED ALWAYS AS (((_raw_data ->> 'application_fee_amount'::text))::integer) STORED,
    automatic_payment_methods text GENERATED ALWAYS AS ((_raw_data ->> 'automatic_payment_methods'::text)) STORED,
    canceled_at integer GENERATED ALWAYS AS (((_raw_data ->> 'canceled_at'::text))::integer) STORED,
    cancellation_reason text GENERATED ALWAYS AS ((_raw_data ->> 'cancellation_reason'::text)) STORED,
    capture_method text GENERATED ALWAYS AS ((_raw_data ->> 'capture_method'::text)) STORED,
    client_secret text GENERATED ALWAYS AS ((_raw_data ->> 'client_secret'::text)) STORED,
    confirmation_method text GENERATED ALWAYS AS ((_raw_data ->> 'confirmation_method'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    currency text GENERATED ALWAYS AS ((_raw_data ->> 'currency'::text)) STORED,
    customer text GENERATED ALWAYS AS ((_raw_data ->> 'customer'::text)) STORED,
    description text GENERATED ALWAYS AS ((_raw_data ->> 'description'::text)) STORED,
    invoice text GENERATED ALWAYS AS ((_raw_data ->> 'invoice'::text)) STORED,
    last_payment_error text GENERATED ALWAYS AS ((_raw_data ->> 'last_payment_error'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    next_action text GENERATED ALWAYS AS ((_raw_data ->> 'next_action'::text)) STORED,
    on_behalf_of text GENERATED ALWAYS AS ((_raw_data ->> 'on_behalf_of'::text)) STORED,
    payment_method text GENERATED ALWAYS AS ((_raw_data ->> 'payment_method'::text)) STORED,
    payment_method_options jsonb GENERATED ALWAYS AS ((_raw_data -> 'payment_method_options'::text)) STORED,
    payment_method_types jsonb GENERATED ALWAYS AS ((_raw_data -> 'payment_method_types'::text)) STORED,
    processing text GENERATED ALWAYS AS ((_raw_data ->> 'processing'::text)) STORED,
    receipt_email text GENERATED ALWAYS AS ((_raw_data ->> 'receipt_email'::text)) STORED,
    review text GENERATED ALWAYS AS ((_raw_data ->> 'review'::text)) STORED,
    setup_future_usage text GENERATED ALWAYS AS ((_raw_data ->> 'setup_future_usage'::text)) STORED,
    shipping jsonb GENERATED ALWAYS AS ((_raw_data -> 'shipping'::text)) STORED,
    statement_descriptor text GENERATED ALWAYS AS ((_raw_data ->> 'statement_descriptor'::text)) STORED,
    statement_descriptor_suffix text GENERATED ALWAYS AS ((_raw_data ->> 'statement_descriptor_suffix'::text)) STORED,
    status text GENERATED ALWAYS AS ((_raw_data ->> 'status'::text)) STORED,
    transfer_data jsonb GENERATED ALWAYS AS ((_raw_data -> 'transfer_data'::text)) STORED,
    transfer_group text GENERATED ALWAYS AS ((_raw_data ->> 'transfer_group'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.payment_intents OWNER TO neondb_owner;

--
-- Name: payment_methods; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe.payment_methods (
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    customer text GENERATED ALWAYS AS ((_raw_data ->> 'customer'::text)) STORED,
    type text GENERATED ALWAYS AS ((_raw_data ->> 'type'::text)) STORED,
    billing_details jsonb GENERATED ALWAYS AS ((_raw_data -> 'billing_details'::text)) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    card jsonb GENERATED ALWAYS AS ((_raw_data -> 'card'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.payment_methods OWNER TO neondb_owner;

--
-- Name: payouts; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe.payouts (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    date text GENERATED ALWAYS AS ((_raw_data ->> 'date'::text)) STORED,
    type text GENERATED ALWAYS AS ((_raw_data ->> 'type'::text)) STORED,
    amount bigint GENERATED ALWAYS AS (((_raw_data ->> 'amount'::text))::bigint) STORED,
    method text GENERATED ALWAYS AS ((_raw_data ->> 'method'::text)) STORED,
    status text GENERATED ALWAYS AS ((_raw_data ->> 'status'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    updated integer GENERATED ALWAYS AS (((_raw_data ->> 'updated'::text))::integer) STORED,
    currency text GENERATED ALWAYS AS ((_raw_data ->> 'currency'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    automatic boolean GENERATED ALWAYS AS (((_raw_data ->> 'automatic'::text))::boolean) STORED,
    recipient text GENERATED ALWAYS AS ((_raw_data ->> 'recipient'::text)) STORED,
    description text GENERATED ALWAYS AS ((_raw_data ->> 'description'::text)) STORED,
    destination text GENERATED ALWAYS AS ((_raw_data ->> 'destination'::text)) STORED,
    source_type text GENERATED ALWAYS AS ((_raw_data ->> 'source_type'::text)) STORED,
    arrival_date text GENERATED ALWAYS AS ((_raw_data ->> 'arrival_date'::text)) STORED,
    bank_account jsonb GENERATED ALWAYS AS ((_raw_data -> 'bank_account'::text)) STORED,
    failure_code text GENERATED ALWAYS AS ((_raw_data ->> 'failure_code'::text)) STORED,
    transfer_group text GENERATED ALWAYS AS ((_raw_data ->> 'transfer_group'::text)) STORED,
    amount_reversed bigint GENERATED ALWAYS AS (((_raw_data ->> 'amount_reversed'::text))::bigint) STORED,
    failure_message text GENERATED ALWAYS AS ((_raw_data ->> 'failure_message'::text)) STORED,
    source_transaction text GENERATED ALWAYS AS ((_raw_data ->> 'source_transaction'::text)) STORED,
    balance_transaction text GENERATED ALWAYS AS ((_raw_data ->> 'balance_transaction'::text)) STORED,
    statement_descriptor text GENERATED ALWAYS AS ((_raw_data ->> 'statement_descriptor'::text)) STORED,
    statement_description text GENERATED ALWAYS AS ((_raw_data ->> 'statement_description'::text)) STORED,
    failure_balance_transaction text GENERATED ALWAYS AS ((_raw_data ->> 'failure_balance_transaction'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.payouts OWNER TO neondb_owner;

--
-- Name: plans; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe.plans (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    name text GENERATED ALWAYS AS ((_raw_data ->> 'name'::text)) STORED,
    tiers jsonb GENERATED ALWAYS AS ((_raw_data -> 'tiers'::text)) STORED,
    active boolean GENERATED ALWAYS AS (((_raw_data ->> 'active'::text))::boolean) STORED,
    amount bigint GENERATED ALWAYS AS (((_raw_data ->> 'amount'::text))::bigint) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    product text GENERATED ALWAYS AS ((_raw_data ->> 'product'::text)) STORED,
    updated integer GENERATED ALWAYS AS (((_raw_data ->> 'updated'::text))::integer) STORED,
    currency text GENERATED ALWAYS AS ((_raw_data ->> 'currency'::text)) STORED,
    "interval" text GENERATED ALWAYS AS ((_raw_data ->> 'interval'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    nickname text GENERATED ALWAYS AS ((_raw_data ->> 'nickname'::text)) STORED,
    tiers_mode text GENERATED ALWAYS AS ((_raw_data ->> 'tiers_mode'::text)) STORED,
    usage_type text GENERATED ALWAYS AS ((_raw_data ->> 'usage_type'::text)) STORED,
    billing_scheme text GENERATED ALWAYS AS ((_raw_data ->> 'billing_scheme'::text)) STORED,
    interval_count bigint GENERATED ALWAYS AS (((_raw_data ->> 'interval_count'::text))::bigint) STORED,
    aggregate_usage text GENERATED ALWAYS AS ((_raw_data ->> 'aggregate_usage'::text)) STORED,
    transform_usage text GENERATED ALWAYS AS ((_raw_data ->> 'transform_usage'::text)) STORED,
    trial_period_days bigint GENERATED ALWAYS AS (((_raw_data ->> 'trial_period_days'::text))::bigint) STORED,
    statement_descriptor text GENERATED ALWAYS AS ((_raw_data ->> 'statement_descriptor'::text)) STORED,
    statement_description text GENERATED ALWAYS AS ((_raw_data ->> 'statement_description'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.plans OWNER TO neondb_owner;

--
-- Name: prices; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe.prices (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    active boolean GENERATED ALWAYS AS (((_raw_data ->> 'active'::text))::boolean) STORED,
    currency text GENERATED ALWAYS AS ((_raw_data ->> 'currency'::text)) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    nickname text GENERATED ALWAYS AS ((_raw_data ->> 'nickname'::text)) STORED,
    recurring jsonb GENERATED ALWAYS AS ((_raw_data -> 'recurring'::text)) STORED,
    type text GENERATED ALWAYS AS ((_raw_data ->> 'type'::text)) STORED,
    unit_amount integer GENERATED ALWAYS AS (((_raw_data ->> 'unit_amount'::text))::integer) STORED,
    billing_scheme text GENERATED ALWAYS AS ((_raw_data ->> 'billing_scheme'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    lookup_key text GENERATED ALWAYS AS ((_raw_data ->> 'lookup_key'::text)) STORED,
    tiers_mode text GENERATED ALWAYS AS ((_raw_data ->> 'tiers_mode'::text)) STORED,
    transform_quantity jsonb GENERATED ALWAYS AS ((_raw_data -> 'transform_quantity'::text)) STORED,
    unit_amount_decimal text GENERATED ALWAYS AS ((_raw_data ->> 'unit_amount_decimal'::text)) STORED,
    product text GENERATED ALWAYS AS ((_raw_data ->> 'product'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.prices OWNER TO neondb_owner;

--
-- Name: products; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe.products (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    active boolean GENERATED ALWAYS AS (((_raw_data ->> 'active'::text))::boolean) STORED,
    default_price text GENERATED ALWAYS AS ((_raw_data ->> 'default_price'::text)) STORED,
    description text GENERATED ALWAYS AS ((_raw_data ->> 'description'::text)) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    name text GENERATED ALWAYS AS ((_raw_data ->> 'name'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    images jsonb GENERATED ALWAYS AS ((_raw_data -> 'images'::text)) STORED,
    marketing_features jsonb GENERATED ALWAYS AS ((_raw_data -> 'marketing_features'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    package_dimensions jsonb GENERATED ALWAYS AS ((_raw_data -> 'package_dimensions'::text)) STORED,
    shippable boolean GENERATED ALWAYS AS (((_raw_data ->> 'shippable'::text))::boolean) STORED,
    statement_descriptor text GENERATED ALWAYS AS ((_raw_data ->> 'statement_descriptor'::text)) STORED,
    unit_label text GENERATED ALWAYS AS ((_raw_data ->> 'unit_label'::text)) STORED,
    updated integer GENERATED ALWAYS AS (((_raw_data ->> 'updated'::text))::integer) STORED,
    url text GENERATED ALWAYS AS ((_raw_data ->> 'url'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.products OWNER TO neondb_owner;

--
-- Name: refunds; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe.refunds (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    amount integer GENERATED ALWAYS AS (((_raw_data ->> 'amount'::text))::integer) STORED,
    balance_transaction text GENERATED ALWAYS AS ((_raw_data ->> 'balance_transaction'::text)) STORED,
    charge text GENERATED ALWAYS AS ((_raw_data ->> 'charge'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    currency text GENERATED ALWAYS AS ((_raw_data ->> 'currency'::text)) STORED,
    destination_details jsonb GENERATED ALWAYS AS ((_raw_data -> 'destination_details'::text)) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    payment_intent text GENERATED ALWAYS AS ((_raw_data ->> 'payment_intent'::text)) STORED,
    reason text GENERATED ALWAYS AS ((_raw_data ->> 'reason'::text)) STORED,
    receipt_number text GENERATED ALWAYS AS ((_raw_data ->> 'receipt_number'::text)) STORED,
    source_transfer_reversal text GENERATED ALWAYS AS ((_raw_data ->> 'source_transfer_reversal'::text)) STORED,
    status text GENERATED ALWAYS AS ((_raw_data ->> 'status'::text)) STORED,
    transfer_reversal text GENERATED ALWAYS AS ((_raw_data ->> 'transfer_reversal'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.refunds OWNER TO neondb_owner;

--
-- Name: reviews; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe.reviews (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    billing_zip text GENERATED ALWAYS AS ((_raw_data ->> 'billing_zip'::text)) STORED,
    charge text GENERATED ALWAYS AS ((_raw_data ->> 'charge'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    closed_reason text GENERATED ALWAYS AS ((_raw_data ->> 'closed_reason'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    ip_address text GENERATED ALWAYS AS ((_raw_data ->> 'ip_address'::text)) STORED,
    ip_address_location jsonb GENERATED ALWAYS AS ((_raw_data -> 'ip_address_location'::text)) STORED,
    open boolean GENERATED ALWAYS AS (((_raw_data ->> 'open'::text))::boolean) STORED,
    opened_reason text GENERATED ALWAYS AS ((_raw_data ->> 'opened_reason'::text)) STORED,
    payment_intent text GENERATED ALWAYS AS ((_raw_data ->> 'payment_intent'::text)) STORED,
    reason text GENERATED ALWAYS AS ((_raw_data ->> 'reason'::text)) STORED,
    session text GENERATED ALWAYS AS ((_raw_data ->> 'session'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.reviews OWNER TO neondb_owner;

--
-- Name: setup_intents; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe.setup_intents (
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    customer text GENERATED ALWAYS AS ((_raw_data ->> 'customer'::text)) STORED,
    description text GENERATED ALWAYS AS ((_raw_data ->> 'description'::text)) STORED,
    payment_method text GENERATED ALWAYS AS ((_raw_data ->> 'payment_method'::text)) STORED,
    status text GENERATED ALWAYS AS ((_raw_data ->> 'status'::text)) STORED,
    usage text GENERATED ALWAYS AS ((_raw_data ->> 'usage'::text)) STORED,
    cancellation_reason text GENERATED ALWAYS AS ((_raw_data ->> 'cancellation_reason'::text)) STORED,
    latest_attempt text GENERATED ALWAYS AS ((_raw_data ->> 'latest_attempt'::text)) STORED,
    mandate text GENERATED ALWAYS AS ((_raw_data ->> 'mandate'::text)) STORED,
    single_use_mandate text GENERATED ALWAYS AS ((_raw_data ->> 'single_use_mandate'::text)) STORED,
    on_behalf_of text GENERATED ALWAYS AS ((_raw_data ->> 'on_behalf_of'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.setup_intents OWNER TO neondb_owner;

--
-- Name: subscription_items; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe.subscription_items (
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    billing_thresholds jsonb GENERATED ALWAYS AS ((_raw_data -> 'billing_thresholds'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    deleted boolean GENERATED ALWAYS AS (((_raw_data ->> 'deleted'::text))::boolean) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    quantity integer GENERATED ALWAYS AS (((_raw_data ->> 'quantity'::text))::integer) STORED,
    price text GENERATED ALWAYS AS ((_raw_data ->> 'price'::text)) STORED,
    subscription text GENERATED ALWAYS AS ((_raw_data ->> 'subscription'::text)) STORED,
    tax_rates jsonb GENERATED ALWAYS AS ((_raw_data -> 'tax_rates'::text)) STORED,
    current_period_end integer GENERATED ALWAYS AS (((_raw_data ->> 'current_period_end'::text))::integer) STORED,
    current_period_start integer GENERATED ALWAYS AS (((_raw_data ->> 'current_period_start'::text))::integer) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.subscription_items OWNER TO neondb_owner;

--
-- Name: subscription_schedules; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe.subscription_schedules (
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    application text GENERATED ALWAYS AS ((_raw_data ->> 'application'::text)) STORED,
    canceled_at integer GENERATED ALWAYS AS (((_raw_data ->> 'canceled_at'::text))::integer) STORED,
    completed_at integer GENERATED ALWAYS AS (((_raw_data ->> 'completed_at'::text))::integer) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    current_phase jsonb GENERATED ALWAYS AS ((_raw_data -> 'current_phase'::text)) STORED,
    customer text GENERATED ALWAYS AS ((_raw_data ->> 'customer'::text)) STORED,
    default_settings jsonb GENERATED ALWAYS AS ((_raw_data -> 'default_settings'::text)) STORED,
    end_behavior text GENERATED ALWAYS AS ((_raw_data ->> 'end_behavior'::text)) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    phases jsonb GENERATED ALWAYS AS ((_raw_data -> 'phases'::text)) STORED,
    released_at integer GENERATED ALWAYS AS (((_raw_data ->> 'released_at'::text))::integer) STORED,
    released_subscription text GENERATED ALWAYS AS ((_raw_data ->> 'released_subscription'::text)) STORED,
    status text GENERATED ALWAYS AS ((_raw_data ->> 'status'::text)) STORED,
    subscription text GENERATED ALWAYS AS ((_raw_data ->> 'subscription'::text)) STORED,
    test_clock text GENERATED ALWAYS AS ((_raw_data ->> 'test_clock'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.subscription_schedules OWNER TO neondb_owner;

--
-- Name: subscriptions; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe.subscriptions (
    _updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    cancel_at_period_end boolean GENERATED ALWAYS AS (((_raw_data ->> 'cancel_at_period_end'::text))::boolean) STORED,
    current_period_end integer GENERATED ALWAYS AS (((_raw_data ->> 'current_period_end'::text))::integer) STORED,
    current_period_start integer GENERATED ALWAYS AS (((_raw_data ->> 'current_period_start'::text))::integer) STORED,
    default_payment_method text GENERATED ALWAYS AS ((_raw_data ->> 'default_payment_method'::text)) STORED,
    items jsonb GENERATED ALWAYS AS ((_raw_data -> 'items'::text)) STORED,
    metadata jsonb GENERATED ALWAYS AS ((_raw_data -> 'metadata'::text)) STORED,
    pending_setup_intent text GENERATED ALWAYS AS ((_raw_data ->> 'pending_setup_intent'::text)) STORED,
    pending_update jsonb GENERATED ALWAYS AS ((_raw_data -> 'pending_update'::text)) STORED,
    status text GENERATED ALWAYS AS ((_raw_data ->> 'status'::text)) STORED,
    application_fee_percent double precision GENERATED ALWAYS AS (((_raw_data ->> 'application_fee_percent'::text))::double precision) STORED,
    billing_cycle_anchor integer GENERATED ALWAYS AS (((_raw_data ->> 'billing_cycle_anchor'::text))::integer) STORED,
    billing_thresholds jsonb GENERATED ALWAYS AS ((_raw_data -> 'billing_thresholds'::text)) STORED,
    cancel_at integer GENERATED ALWAYS AS (((_raw_data ->> 'cancel_at'::text))::integer) STORED,
    canceled_at integer GENERATED ALWAYS AS (((_raw_data ->> 'canceled_at'::text))::integer) STORED,
    collection_method text GENERATED ALWAYS AS ((_raw_data ->> 'collection_method'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    days_until_due integer GENERATED ALWAYS AS (((_raw_data ->> 'days_until_due'::text))::integer) STORED,
    default_source text GENERATED ALWAYS AS ((_raw_data ->> 'default_source'::text)) STORED,
    default_tax_rates jsonb GENERATED ALWAYS AS ((_raw_data -> 'default_tax_rates'::text)) STORED,
    discount jsonb GENERATED ALWAYS AS ((_raw_data -> 'discount'::text)) STORED,
    ended_at integer GENERATED ALWAYS AS (((_raw_data ->> 'ended_at'::text))::integer) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    next_pending_invoice_item_invoice integer GENERATED ALWAYS AS (((_raw_data ->> 'next_pending_invoice_item_invoice'::text))::integer) STORED,
    pause_collection jsonb GENERATED ALWAYS AS ((_raw_data -> 'pause_collection'::text)) STORED,
    pending_invoice_item_interval jsonb GENERATED ALWAYS AS ((_raw_data -> 'pending_invoice_item_interval'::text)) STORED,
    start_date integer GENERATED ALWAYS AS (((_raw_data ->> 'start_date'::text))::integer) STORED,
    transfer_data jsonb GENERATED ALWAYS AS ((_raw_data -> 'transfer_data'::text)) STORED,
    trial_end jsonb GENERATED ALWAYS AS ((_raw_data -> 'trial_end'::text)) STORED,
    trial_start jsonb GENERATED ALWAYS AS ((_raw_data -> 'trial_start'::text)) STORED,
    schedule text GENERATED ALWAYS AS ((_raw_data ->> 'schedule'::text)) STORED,
    customer text GENERATED ALWAYS AS ((_raw_data ->> 'customer'::text)) STORED,
    latest_invoice text GENERATED ALWAYS AS ((_raw_data ->> 'latest_invoice'::text)) STORED,
    plan text GENERATED ALWAYS AS ((_raw_data ->> 'plan'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.subscriptions OWNER TO neondb_owner;

--
-- Name: tax_ids; Type: TABLE; Schema: stripe; Owner: neondb_owner
--

CREATE TABLE stripe.tax_ids (
    _last_synced_at timestamp with time zone,
    _raw_data jsonb,
    _account_id text NOT NULL,
    object text GENERATED ALWAYS AS ((_raw_data ->> 'object'::text)) STORED,
    country text GENERATED ALWAYS AS ((_raw_data ->> 'country'::text)) STORED,
    customer text GENERATED ALWAYS AS ((_raw_data ->> 'customer'::text)) STORED,
    type text GENERATED ALWAYS AS ((_raw_data ->> 'type'::text)) STORED,
    value text GENERATED ALWAYS AS ((_raw_data ->> 'value'::text)) STORED,
    created integer GENERATED ALWAYS AS (((_raw_data ->> 'created'::text))::integer) STORED,
    livemode boolean GENERATED ALWAYS AS (((_raw_data ->> 'livemode'::text))::boolean) STORED,
    owner jsonb GENERATED ALWAYS AS ((_raw_data -> 'owner'::text)) STORED,
    id text GENERATED ALWAYS AS ((_raw_data ->> 'id'::text)) STORED NOT NULL
);


ALTER TABLE stripe.tax_ids OWNER TO neondb_owner;

--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: neondb_owner
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Name: applications id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.applications ALTER COLUMN id SET DEFAULT nextval('public.applications_id_seq'::regclass);


--
-- Name: listings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.listings ALTER COLUMN id SET DEFAULT nextval('public.listings_id_seq'::regclass);


--
-- Name: password_reset_tokens id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.password_reset_tokens ALTER COLUMN id SET DEFAULT nextval('public.password_reset_tokens_id_seq'::regclass);


--
-- Name: subscriptions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.subscriptions ALTER COLUMN id SET DEFAULT nextval('public.subscriptions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: _sync_status id; Type: DEFAULT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe._sync_status ALTER COLUMN id SET DEFAULT nextval('stripe._sync_status_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: neondb_owner
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
\.


--
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.applications (id, tenant_id, listing_id, status, data, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: listings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.listings (id, provider_id, property_name, address, city, state, monthly_price, total_beds, gender, room_type, description, amenities, inclusions, photos, supervision_type, is_mat_friendly, is_pet_friendly, is_lgbtq_friendly, is_faith_based, status, created_at) FROM stdin;
1	8	Recovery First Residence	123 Recovery Lane	Phoenix	AZ	1200	12	Men Only	Shared Room	A supportive environment for men in recovery with 24/7 staff support and structured programming.	["WiFi", "Gym", "Pool", "Laundry"]	["Utilities", "Meals", "Transportation"]	[]	Staff on Premises 24/7	t	f	t	f	approved	2025-11-11 02:55:59.515776
2	9	Hope House Women's Home	456 Hope Street	Scottsdale	AZ	1500	8	Women Only	Private Room	A peaceful women-only recovery home with private rooms and therapeutic activities.	["WiFi", "Garden", "Meditation Room", "Laundry"]	["Utilities", "Weekly Therapy", "Job Training"]	[]	House Manager	t	t	t	f	approved	2025-11-18 02:55:59.515776
3	10	Serenity Living Co-Ed	789 Serenity Blvd	Tempe	AZ	1100	16	Co-Ed	Shared Room	Co-ed sober living with separate wings for men and women. Focus on community and peer support.	["WiFi", "BBQ Area", "Game Room", "Parking"]	["Utilities", "House Meetings"]	[]	Peer Support	f	f	t	f	approved	2025-11-28 02:55:59.515776
4	11	New Beginnings Faith Home	321 Faith Avenue	Mesa	AZ	950	10	Men Only	Shared Room	Faith-based recovery home with daily devotionals and church partnerships.	["WiFi", "Chapel", "Library", "Laundry"]	["Utilities", "Meals", "Bible Study"]	[]	House Manager	t	f	f	t	pending	2025-12-05 02:55:59.515776
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.password_reset_tokens (id, user_id, token, expires_at, used_at, created_at) FROM stdin;
1	2	318adfb158bfefd989c07659db709f49555833c608f253f6a4b305165fb67d4d	2025-12-06 03:16:05.335	\N	2025-12-06 02:46:05.34846
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.session (sid, sess, expire) FROM stdin;
L2DBskVotARzoIAH-lx3-yIPbTA5FO55	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"},"passport":{"user":4}}	2025-12-08 04:25:57
DnSBIcjZTQ7OVl55fEn1HTh2E2viN11B	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"},"passport":{"user":13}}	2025-12-09 00:59:08
jMbqdlaFLhmOl5pDi5dKBaiuLhEz7trB	{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"},"passport":{"user":16}}	2025-12-09 01:58:07
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.subscriptions (id, provider_id, status, current_period_end, payment_method, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, username, email, password, name, role, stripe_customer_id, stripe_subscription_id, created_at, google_id) FROM stdin;
1	Hhh	vee@vee.com	$2b$10$brQhAxYpyOXpZZqCXV2dfuE5O2HU3oVadvaMv7Jrmbc7y4piGvMiW	Hh	provider	cus_TXBhlIW5vEDNvP	\N	2025-12-03 04:05:42.973311	\N
2	veronicamerrick91650	veronicamerrick91@gmail.com	0.jd24h3p0jr0.ex7awcrc31	Veronica Merrick	tenant	\N	\N	2025-12-04 07:18:04.709958	110468608210785317828
3	admin	support@soberstayhomes.com	$2b$10$V/3Z5OUHW8vH/nli6SzVNO3uY3b6PkMJGj3ervf64QJKlh7OWOpMi	Administrator	admin	\N	\N	2025-12-05 02:22:09.133873	\N
4	john_doe	john.doe@gmail.com	$2b$10$iYVyBddIuOUSKBryGQJM/usXTHSfOynboiuIbTtcTHF/.Lzfe/E6S	John Doe	tenant	\N	\N	2025-12-01 02:55:29.027533	\N
5	sarah_m	sarah.miller@yahoo.com	$2b$10$iYVyBddIuOUSKBryGQJM/usXTHSfOynboiuIbTtcTHF/.Lzfe/E6S	Sarah Miller	tenant	\N	\N	2025-12-03 02:55:29.027533	\N
6	mike_j	mike.johnson@outlook.com	$2b$10$iYVyBddIuOUSKBryGQJM/usXTHSfOynboiuIbTtcTHF/.Lzfe/E6S	Mike Johnson	tenant	\N	\N	2025-12-05 02:55:29.027533	\N
7	emily_w	emily.wilson@gmail.com	$2b$10$iYVyBddIuOUSKBryGQJM/usXTHSfOynboiuIbTtcTHF/.Lzfe/E6S	Emily Wilson	tenant	\N	\N	2025-12-06 02:55:29.027533	\N
8	recovery_first	admin@recoveryfirst.com	$2b$10$iYVyBddIuOUSKBryGQJM/usXTHSfOynboiuIbTtcTHF/.Lzfe/E6S	Recovery First LLC	provider	\N	\N	2025-11-06 02:55:29.027533	\N
9	hope_house	contact@hopehouse.org	$2b$10$iYVyBddIuOUSKBryGQJM/usXTHSfOynboiuIbTtcTHF/.Lzfe/E6S	Hope House	provider	\N	\N	2025-11-16 02:55:29.027533	\N
10	serenity_living	info@serenityliving.com	$2b$10$iYVyBddIuOUSKBryGQJM/usXTHSfOynboiuIbTtcTHF/.Lzfe/E6S	Serenity Living	provider	\N	\N	2025-11-26 02:55:29.027533	\N
11	new_beginnings	office@newbeginnings.org	$2b$10$iYVyBddIuOUSKBryGQJM/usXTHSfOynboiuIbTtcTHF/.Lzfe/E6S	New Beginnings Home	provider	\N	\N	2025-12-04 02:55:29.027533	\N
12	tenant	tenant@test.com	$2b$10$j0PW8kXr68.GkBVIFfETTOMnIqMAEGcv5a8WJgFaEJ.U.lCq8gJTu	Test Tenant	tenant	\N	\N	2025-12-08 00:46:12.02399	\N
13	provider	provider@test.com	$2b$10$pmEWI/VAKenhzikDDToDcObGpsXQVqSAEVe54rLE.9yrJA3XPofyy	Test Provider	provider	\N	\N	2025-12-08 00:46:12.146105	\N
16	admin1898	admin@test.com	$2b$10$l61ajVYHw7fPtsMRFUiOkuujhxcAPpAVxl.BCSafO4Q2F8lR68LOa	Test Admin	admin	\N	\N	2025-12-08 00:46:35.14781	\N
\.


--
-- Data for Name: _managed_webhooks; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe._managed_webhooks (id, object, uuid, url, enabled_events, description, enabled, livemode, metadata, secret, status, api_version, created, updated_at, last_synced_at, account_id) FROM stdin;
we_1Sa7CAPBUlX7cw67PUjHT0vC	webhook_endpoint	6525b33e-7a40-4aed-b274-f745c3fd00dd	https://81e67262-816b-4fb6-81d9-b08eca5409c7-00-2wlgvrsww8k5f.picard.replit.dev/api/stripe/webhook/6525b33e-7a40-4aed-b274-f745c3fd00dd	["*"]	Managed webhook for Stripe sync	\N	f	{}	whsec_hh1w7MKaynbVMGihjxhQBuLfIPRmtJTd	enabled	\N	1764734258	2025-12-03 03:57:38.698026+00	2025-12-03 03:57:38.683+00	acct_1SZwOrPBUlX7cw67
\.


--
-- Data for Name: _migrations; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe._migrations (id, name, hash, executed_at) FROM stdin;
0	initial_migration	c18983eedaa79cc2f6d92727d70c4f772256ef3d	2025-12-03 03:57:28.050066
1	products	b99ffc23df668166b94156f438bfa41818d4e80c	2025-12-03 03:57:28.133796
2	customers	33e481247ddc217f4e27ad10dfe5430097981670	2025-12-03 03:57:28.219905
3	prices	7d5ff35640651606cc24cec8a73ff7c02492ecdf	2025-12-03 03:57:28.304383
4	subscriptions	2cc6121a943c2a623c604e5ab12118a57a6c329a	2025-12-03 03:57:28.396805
5	invoices	7fbb4ccb4ed76a830552520739aaa163559771b1	2025-12-03 03:57:28.483628
6	charges	fb284ed969f033f5ce19f479b7a7e27871bddf09	2025-12-03 03:57:28.569643
7	coupons	7ed6ec4133f120675fd7888c0477b6281743fede	2025-12-03 03:57:28.654441
8	disputes	29bdb083725efe84252647f043f5f91cd0dabf43	2025-12-03 03:57:28.7382
9	events	b28cb55b5b69a9f52ef519260210cd76eea3c84e	2025-12-03 03:57:28.824456
10	payouts	69d1050b88bba1024cea4a671f9633ce7bfe25ff	2025-12-03 03:57:28.909279
11	plans	fc1ae945e86d1222a59cbcd3ae7e81a3a282a60c	2025-12-03 03:57:28.99426
12	add_updated_at	1d80945ef050a17a26e35e9983a58178262470f2	2025-12-03 03:57:29.079123
13	add_subscription_items	2aa63409bfe910add833155ad7468cdab844e0f1	2025-12-03 03:57:29.171734
14	migrate_subscription_items	8c2a798b44a8a0d83ede6f50ea7113064ecc1807	2025-12-03 03:57:29.258602
15	add_customer_deleted	6886ddfd8c129d3c4b39b59519f92618b397b395	2025-12-03 03:57:29.344075
16	add_invoice_indexes	d6bb9a09d5bdf580986ed14f55db71227a4d356d	2025-12-03 03:57:29.425606
17	drop_charges_unavailable_columns	61cd5adec4ae2c308d2c33d1b0ed203c7d074d6a	2025-12-03 03:57:29.50855
18	setup_intents	1d45d0fa47fc145f636c9e3c1ea692417fbb870d	2025-12-03 03:57:29.593429
19	payment_methods	705bdb15b50f1a97260b4f243008b8a34d23fb09	2025-12-03 03:57:29.682819
20	disputes_payment_intent_created_idx	18b2cecd7c097a7ea3b3f125f228e8790288d5ca	2025-12-03 03:57:29.769658
21	payment_intent	b1f194ff521b373c4c7cf220c0feadc253ebff0b	2025-12-03 03:57:29.8515
22	adjust_plans	e4eae536b0bc98ee14d78e818003952636ee877c	2025-12-03 03:57:29.938493
23	invoice_deleted	78e864c3146174fee7d08f05226b02d931d5b2ae	2025-12-03 03:57:30.021634
24	subscription_schedules	85fa6adb3815619bb17e1dafb00956ff548f7332	2025-12-03 03:57:30.104565
25	tax_ids	3f9a1163533f9e60a53d61dae5e451ab937584d9	2025-12-03 03:57:30.192565
26	credit_notes	e099b6b04ee607ee868d82af5193373c3fc266d2	2025-12-03 03:57:30.278005
27	add_marketing_features_to_products	6ed1774b0a9606c5937b2385d61057408193e8a7	2025-12-03 03:57:30.366076
28	early_fraud_warning	e615b0b73fa13d3b0508a1956d496d516f0ebf40	2025-12-03 03:57:30.447686
29	reviews	dd3f914139725a7934dc1062de4cc05aece77aea	2025-12-03 03:57:30.533456
30	refunds	f76c4e273eccdc96616424d73967a9bea3baac4e	2025-12-03 03:57:30.621093
31	add_default_price	6d10566a68bc632831fa25332727d8ff842caec5	2025-12-03 03:57:30.707116
32	update_subscription_items	e894858d46840ba4be5ea093cdc150728bd1d66f	2025-12-03 03:57:30.790657
33	add_last_synced_at	43124eb65b18b70c54d57d2b4fcd5dae718a200f	2025-12-03 03:57:30.872893
34	remove_foreign_keys	e72ec19f3232cf6e6b7308ebab80341c2341745f	2025-12-03 03:57:30.958813
35	checkout_sessions	dc294f5bb1a4d613be695160b38a714986800a75	2025-12-03 03:57:31.042044
36	checkout_session_line_items	82c8cfce86d68db63a9fa8de973bfe60c91342dd	2025-12-03 03:57:31.130529
37	add_features	c68a2c2b7e3808eed28c8828b2ffd3a2c9bf2bd4	2025-12-03 03:57:31.221851
38	active_entitlement	5b3858e7a52212b01e7f338cf08e29767ab362af	2025-12-03 03:57:31.307177
39	add_paused_to_subscription_status	09012b5d128f6ba25b0c8f69a1203546cf1c9f10	2025-12-03 03:57:31.393827
40	managed_webhooks	1d453dfd0e27ff0c2de97955c4ec03919af0af7f	2025-12-03 03:57:31.475982
41	rename_managed_webhooks	ad7cd1e4971a50790bf997cd157f3403d294484f	2025-12-03 03:57:31.56369
42	convert_to_jsonb_generated_columns	e0703a0e5cd9d97db53d773ada1983553e37813c	2025-12-03 03:57:31.645172
43	add_account_id	9a6beffdd0972e3657b7118b2c5001be1f815faf	2025-12-03 03:57:34.072414
44	make_account_id_required	05c1e9145220e905e0c1ca5329851acaf7e9e506	2025-12-03 03:57:34.162438
45	sync_status	2f88c4883fa885a6eaa23b8b02da958ca77a1c21	2025-12-03 03:57:34.256729
46	sync_status_per_account	b1f1f3d4fdb4b4cf4e489d4b195c7f0f97f9f27c	2025-12-03 03:57:34.345121
47	api_key_hashes	8046e4c57544b8eae277b057d201a28a4529ffe3	2025-12-03 03:57:34.45778
48	rename_reserved_columns	e32290f655550ed308a7f2dcb5b0114e49a0558e	2025-12-03 03:57:34.543203
49	remove_redundant_underscores_from_metadata_tables	96d6f3a54e17d8e19abd022a030a95a6161bf73e	2025-12-03 03:57:37.310871
50	rename_id_to_match_stripe_api	c5300c5a10081c033dab9961f4e3cd6a2440c2b6	2025-12-03 03:57:37.401103
\.


--
-- Data for Name: _sync_status; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe._sync_status (id, resource, status, last_synced_at, last_incremental_cursor, error_message, updated_at, account_id) FROM stdin;
7	invoices	complete	2025-12-03 04:57:48.132076+00	2025-12-03 04:07:01+00	\N	2025-12-03 04:57:48.152218+00	acct_1SZwOrPBUlX7cw67
8	charges	complete	2025-12-03 04:57:48.504083+00	2025-12-03 04:07:02+00	\N	2025-12-03 04:57:48.527189+00	acct_1SZwOrPBUlX7cw67
9	setup_intents	complete	2025-12-03 03:57:40.78142+00	\N	\N	2025-12-03 04:57:48.744927+00	acct_1SZwOrPBUlX7cw67
10	payment_intents	complete	2025-12-03 04:57:49.298439+00	2025-12-03 04:07:01+00	\N	2025-12-03 04:57:49.319587+00	acct_1SZwOrPBUlX7cw67
11	credit_notes	complete	2025-12-03 03:57:41.405915+00	\N	\N	2025-12-03 04:57:49.725987+00	acct_1SZwOrPBUlX7cw67
12	disputes	complete	2025-12-03 03:57:41.615304+00	\N	\N	2025-12-03 04:57:49.961822+00	acct_1SZwOrPBUlX7cw67
13	early_fraud_warnings	complete	2025-12-03 03:57:41.850281+00	\N	\N	2025-12-03 04:57:50.190527+00	acct_1SZwOrPBUlX7cw67
14	refunds	complete	2025-12-03 03:57:42.068833+00	\N	\N	2025-12-03 04:57:50.41198+00	acct_1SZwOrPBUlX7cw67
15	checkout_sessions	complete	2025-12-03 04:57:50.969519+00	2025-12-03 04:06:07+00	\N	2025-12-03 04:57:50.989798+00	acct_1SZwOrPBUlX7cw67
1	products	complete	2025-12-03 04:57:43.185169+00	2025-12-03 03:57:46+00	\N	2025-12-03 04:57:43.208975+00	acct_1SZwOrPBUlX7cw67
2	prices	complete	2025-12-03 04:57:43.618806+00	2025-12-03 03:57:46+00	\N	2025-12-03 04:57:43.870941+00	acct_1SZwOrPBUlX7cw67
3	plans	complete	2025-12-03 04:57:44.209444+00	2025-12-03 03:57:46+00	\N	2025-12-03 04:57:44.279902+00	acct_1SZwOrPBUlX7cw67
4	customers	complete	2025-12-03 04:57:44.571635+00	2025-12-03 04:06:06+00	\N	2025-12-03 04:57:44.593902+00	acct_1SZwOrPBUlX7cw67
5	subscriptions	complete	2025-12-03 04:57:47.031507+00	2025-12-03 04:07:01+00	\N	2025-12-03 04:57:47.06193+00	acct_1SZwOrPBUlX7cw67
6	subscription_schedules	complete	2025-12-03 03:57:40.139478+00	\N	\N	2025-12-03 04:57:47.549195+00	acct_1SZwOrPBUlX7cw67
\.


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe.accounts (_raw_data, first_synced_at, _last_synced_at, _updated_at, api_key_hashes) FROM stdin;
{"id": "acct_1SZwOrPBUlX7cw67", "type": "standard", "email": null, "object": "account", "country": "US", "settings": {"payouts": {"schedule": {"interval": "daily", "delay_days": 2}, "statement_descriptor": null, "debit_negative_balances": true}, "branding": {"icon": null, "logo": null, "primary_color": null, "secondary_color": null}, "invoices": {"default_account_tax_ids": null, "hosted_payment_method_save": "offer"}, "payments": {"statement_descriptor": null, "statement_descriptor_kana": null, "statement_descriptor_kanji": null}, "dashboard": {"timezone": "Etc/UTC", "display_name": "SoberStay Sandbox"}, "card_issuing": {"tos_acceptance": {"ip": null, "date": null}}, "card_payments": {"statement_descriptor_prefix": null, "statement_descriptor_prefix_kana": null, "statement_descriptor_prefix_kanji": null}, "bacs_debit_payments": {"display_name": null, "service_user_number": null}, "sepa_debit_payments": {}}, "controller": {"type": "account"}, "capabilities": {}, "business_type": null, "charges_enabled": false, "payouts_enabled": false, "business_profile": {"mcc": null, "url": null, "name": null, "support_url": null, "support_email": null, "support_phone": null, "annual_revenue": null, "support_address": null, "estimated_worker_count": null, "minority_owned_business_designation": null}, "default_currency": "usd", "details_submitted": false}	2025-12-03 03:57:38.666677+00	2025-12-03 03:57:38.666677+00	2025-12-03 03:57:38.666677+00	{19777c5992c254134678405e4f1a8405c3c06a77fbe1c598e6a6d38af9dee06f}
\.


--
-- Data for Name: active_entitlements; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe.active_entitlements (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: charges; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe.charges (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
2025-12-03 04:57:48.45439+00	2025-12-03 04:57:48.445+00	{"id": "ch_3Sa7LFPBUlX7cw671oOYSkFM", "paid": true, "order": null, "amount": 4900, "object": "charge", "review": null, "source": null, "status": "succeeded", "created": 1764734822, "dispute": null, "outcome": {"type": "authorized", "reason": null, "risk_level": "normal", "risk_score": 41, "advice_code": null, "network_status": "approved_by_network", "seller_message": "Payment complete.", "network_advice_code": null, "network_decline_code": null}, "captured": true, "currency": "usd", "customer": "cus_TXBhlIW5vEDNvP", "disputed": false, "livemode": false, "metadata": {}, "refunded": false, "shipping": null, "application": null, "description": "Subscription creation", "destination": null, "receipt_url": "https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xU1p3T3JQQlVsWDdjdzY3KMyGv8kGMgaVOHuXriI6LBbqHx1blFe4oDCW0VUHVyVhUWbtfJ0N79RqmK-pVPt6eRaKS0j9bQIk3X8M?s=ap", "failure_code": null, "on_behalf_of": null, "fraud_details": {}, "radar_options": {}, "receipt_email": null, "transfer_data": null, "payment_intent": "pi_3Sa7LFPBUlX7cw671H8R0ium", "payment_method": "pm_1Sa7LEPBUlX7cw67McLmGqdC", "receipt_number": null, "transfer_group": null, "amount_captured": 4900, "amount_refunded": 0, "application_fee": null, "billing_details": {"name": "Veronica Merrick", "email": "vee@vee.com", "phone": null, "tax_id": null, "address": {"city": "Los Angeles", "line1": "5461 Yarmouth Ave", "line2": "35", "state": "CA", "country": "US", "postal_code": "91316"}}, "failure_message": null, "source_transfer": null, "balance_transaction": "txn_3Sa7LFPBUlX7cw6717dH1CpW", "statement_descriptor": null, "application_fee_amount": null, "payment_method_details": {"card": {"brand": "visa", "last4": "1879", "checks": {"cvc_check": null, "address_line1_check": "unchecked", "address_postal_code_check": "unchecked"}, "wallet": {"type": "apple_pay", "apple_pay": {"type": "apple_pay"}, "dynamic_last4": "8550"}, "country": "US", "funding": "debit", "mandate": null, "network": "visa", "exp_year": 2031, "exp_month": 12, "fingerprint": "OoQF6SHru2gKsSjT", "overcapture": {"status": "unavailable", "maximum_amount_capturable": 4900}, "installments": null, "multicapture": {"status": "unavailable"}, "network_token": {"used": false}, "three_d_secure": null, "regulated_status": "regulated", "amount_authorized": 4900, "authorization_code": "189411", "extended_authorization": {"status": "disabled"}, "network_transaction_id": "791118170548372", "incremental_authorization": {"status": "unavailable"}}, "type": "card"}, "failure_balance_transaction": null, "statement_descriptor_suffix": null, "calculated_statement_descriptor": "Stripe"}	acct_1SZwOrPBUlX7cw67
\.


--
-- Data for Name: checkout_session_line_items; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe.checkout_session_line_items (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
2025-12-03 04:57:50.939213+00	2025-12-03 04:57:50.929+00	{"id": "li_1Sa7KNPBUlX7cw67UUHf8jNY", "price": "price_1Sa7CIPBUlX7cw67f5eJMTf6", "object": "item", "currency": "usd", "metadata": {}, "quantity": 1, "amount_tax": 0, "description": "Provider Monthly Subscription", "amount_total": 4900, "amount_discount": 0, "amount_subtotal": 4900, "checkout_session": "cs_test_a1Pr9VLelz8BoQ1O7WNq2h0Gb24abEjNyUeU4AAWniuxNyYGSDYCOB90pd"}	acct_1SZwOrPBUlX7cw67
\.


--
-- Data for Name: checkout_sessions; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe.checkout_sessions (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
2025-12-03 04:57:50.679716+00	2025-12-03 04:57:50.67+00	{"id": "cs_test_a1Pr9VLelz8BoQ1O7WNq2h0Gb24abEjNyUeU4AAWniuxNyYGSDYCOB90pd", "url": null, "mode": "subscription", "locale": null, "object": "checkout.session", "status": "complete", "consent": null, "created": 1764734767, "invoice": "in_1Sa7LFPBUlX7cw67yoVishQP", "ui_mode": "hosted", "currency": "usd", "customer": "cus_TXBhlIW5vEDNvP", "livemode": false, "metadata": {}, "discounts": [], "cancel_url": "https://81e67262-816b-4fb6-81d9-b08eca5409c7-00-2wlgvrsww8k5f.picard.replit.dev/provider-dashboard?payment=cancelled", "expires_at": 1764821167, "custom_text": {"submit": null, "after_submit": null, "shipping_address": null, "terms_of_service_acceptance": null}, "permissions": null, "submit_type": null, "success_url": "https://81e67262-816b-4fb6-81d9-b08eca5409c7-00-2wlgvrsww8k5f.picard.replit.dev/provider-dashboard?payment=success", "amount_total": 4900, "payment_link": null, "setup_intent": null, "subscription": "sub_1Sa7LIPBUlX7cw67li4ldB3N", "automatic_tax": {"status": null, "enabled": false, "provider": null, "liability": null}, "client_secret": null, "custom_fields": [], "shipping_cost": null, "total_details": {"amount_tax": 0, "amount_discount": 0, "amount_shipping": 0}, "customer_email": null, "origin_context": null, "payment_intent": null, "payment_status": "paid", "recovered_from": null, "wallet_options": null, "amount_subtotal": 4900, "adaptive_pricing": {"enabled": true}, "after_expiration": null, "customer_details": {"name": "Hh", "email": "vee@vee.com", "phone": null, "address": {"city": "Los Angeles", "line1": "5461 Yarmouth Ave", "line2": "35", "state": "CA", "country": "US", "postal_code": "91316"}, "tax_ids": [], "tax_exempt": "none", "business_name": null, "individual_name": null}, "invoice_creation": null, "shipping_options": [], "branding_settings": {"icon": null, "logo": null, "font_family": "default", "border_style": "rounded", "button_color": "#0074d4", "display_name": "SoberStay Sandbox", "background_color": "#ffffff"}, "customer_creation": null, "consent_collection": null, "client_reference_id": null, "currency_conversion": null, "payment_method_types": ["card"], "allow_promotion_codes": null, "collected_information": {"business_name": null, "individual_name": null, "shipping_details": null}, "payment_method_options": {"card": {"request_three_d_secure": "automatic"}}, "phone_number_collection": {"enabled": false}, "payment_method_collection": "always", "billing_address_collection": null, "shipping_address_collection": null, "saved_payment_method_options": {"payment_method_save": null, "payment_method_remove": "disabled", "allow_redisplay_filters": ["always"]}, "payment_method_configuration_details": null}	acct_1SZwOrPBUlX7cw67
\.


--
-- Data for Name: coupons; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe.coupons (_updated_at, _last_synced_at, _raw_data) FROM stdin;
\.


--
-- Data for Name: credit_notes; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe.credit_notes (_last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe.customers (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
2025-12-03 04:57:44.528596+00	2025-12-03 04:57:44.519+00	{"id": "cus_TXBhlIW5vEDNvP", "name": "Hh", "email": "vee@vee.com", "phone": null, "object": "customer", "address": null, "balance": 0, "created": 1764734766, "currency": "usd", "discount": null, "livemode": false, "metadata": {"userId": "1"}, "shipping": null, "delinquent": false, "tax_exempt": "none", "test_clock": null, "description": null, "default_source": null, "invoice_prefix": "Z2VGXNST", "invoice_settings": {"footer": null, "custom_fields": null, "rendering_options": null, "default_payment_method": null}, "preferred_locales": [], "next_invoice_sequence": 2}	acct_1SZwOrPBUlX7cw67
\.


--
-- Data for Name: disputes; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe.disputes (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: early_fraud_warnings; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe.early_fraud_warnings (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe.events (_updated_at, _last_synced_at, _raw_data) FROM stdin;
\.


--
-- Data for Name: features; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe.features (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe.invoices (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
2025-12-03 04:57:48.050216+00	2025-12-03 04:57:48.04+00	{"id": "in_1Sa7LFPBUlX7cw67yoVishQP", "lines": {"url": "/v1/invoices/in_1Sa7LFPBUlX7cw67yoVishQP/lines", "data": [{"id": "il_1Sa7LFPBUlX7cw67KhSBKBoA", "taxes": [], "amount": 4900, "object": "line_item", "parent": {"type": "subscription_item_details", "invoice_item_details": null, "subscription_item_details": {"proration": false, "invoice_item": null, "subscription": "sub_1Sa7LIPBUlX7cw67li4ldB3N", "proration_details": {"credited_items": null}, "subscription_item": "si_TXBicJZ8HKc99S"}}, "period": {"end": 1767413221, "start": 1764734821}, "invoice": "in_1Sa7LFPBUlX7cw67yoVishQP", "pricing": {"type": "price_details", "price_details": {"price": "price_1Sa7CIPBUlX7cw67f5eJMTf6", "product": "prod_TXBZEQFMYZLmTq"}, "unit_amount_decimal": "4900"}, "currency": "usd", "livemode": false, "metadata": {}, "quantity": 1, "discounts": [], "description": "1 × Provider Monthly Subscription (at $49.00 / month)", "discountable": true, "discount_amounts": [], "pretax_credit_amounts": []}], "object": "list", "has_more": false, "total_count": 1}, "total": 4900, "footer": null, "issuer": {"type": "self"}, "number": "Z2VGXNST-0001", "object": "invoice", "parent": {"type": "subscription_details", "quote_details": null, "subscription_details": {"metadata": {}, "subscription": "sub_1Sa7LIPBUlX7cw67li4ldB3N"}}, "status": "paid", "created": 1764734821, "currency": "usd", "customer": "cus_TXBhlIW5vEDNvP", "due_date": null, "livemode": false, "metadata": {}, "subtotal": 4900, "attempted": true, "discounts": [], "rendering": null, "amount_due": 4900, "period_end": 1764734821, "test_clock": null, "amount_paid": 4900, "application": null, "description": null, "invoice_pdf": "https://pay.stripe.com/invoice/acct_1SZwOrPBUlX7cw67/test_YWNjdF8xU1p3T3JQQlVsWDdjdzY3LF9UWEJpb3hib2hOVTF0NHhNdXhkR1ZWc0VqMFMyeEtMLDE1NTI3ODY2Nw0200deGn9orh/pdf?s=ap", "total_taxes": [], "account_name": "SoberStay Sandbox", "auto_advance": false, "effective_at": 1764734821, "from_invoice": null, "on_behalf_of": null, "period_start": 1764734821, "attempt_count": 0, "automatic_tax": {"status": null, "enabled": false, "provider": null, "liability": null, "disabled_reason": null}, "custom_fields": null, "customer_name": "Hh", "shipping_cost": null, "billing_reason": "subscription_create", "customer_email": "vee@vee.com", "customer_phone": null, "default_source": null, "ending_balance": 0, "receipt_number": null, "account_country": "US", "account_tax_ids": null, "amount_overpaid": 0, "amount_shipping": 0, "latest_revision": null, "amount_remaining": 0, "customer_address": null, "customer_tax_ids": [], "payment_settings": {"default_mandate": null, "payment_method_types": ["card"], "payment_method_options": {"card": {"request_three_d_secure": "automatic"}, "konbini": null, "acss_debit": null, "bancontact": null, "sepa_debit": null, "us_bank_account": null, "customer_balance": null}}, "shipping_details": null, "starting_balance": 0, "collection_method": "charge_automatically", "customer_shipping": null, "default_tax_rates": [], "hosted_invoice_url": "https://invoice.stripe.com/i/acct_1SZwOrPBUlX7cw67/test_YWNjdF8xU1p3T3JQQlVsWDdjdzY3LF9UWEJpb3hib2hOVTF0NHhNdXhkR1ZWc0VqMFMyeEtMLDE1NTI3ODY2Nw0200deGn9orh?s=ap", "status_transitions": {"paid_at": 1764734822, "voided_at": null, "finalized_at": 1764734821, "marked_uncollectible_at": null}, "customer_tax_exempt": "none", "total_excluding_tax": 4900, "next_payment_attempt": null, "statement_descriptor": null, "webhooks_delivered_at": 1764734827, "default_payment_method": null, "subtotal_excluding_tax": 4900, "total_discount_amounts": [], "last_finalization_error": null, "automatically_finalizes_at": null, "total_pretax_credit_amounts": [], "pre_payment_credit_notes_amount": 0, "post_payment_credit_notes_amount": 0}	acct_1SZwOrPBUlX7cw67
\.


--
-- Data for Name: payment_intents; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe.payment_intents (_last_synced_at, _raw_data, _account_id) FROM stdin;
2025-12-03 04:57:49.242+00	{"id": "pi_3Sa7LFPBUlX7cw671H8R0ium", "amount": 4900, "object": "payment_intent", "review": null, "source": null, "status": "succeeded", "created": 1764734821, "currency": "usd", "customer": "cus_TXBhlIW5vEDNvP", "livemode": false, "metadata": {}, "shipping": null, "processing": null, "application": null, "canceled_at": null, "description": "Subscription creation", "next_action": null, "on_behalf_of": null, "client_secret": "pi_3Sa7LFPBUlX7cw671H8R0ium_secret_RvsMRy3VakJo2KdqG7t6PdfGQ", "latest_charge": "ch_3Sa7LFPBUlX7cw671oOYSkFM", "receipt_email": null, "transfer_data": null, "amount_details": {"tip": {}}, "capture_method": "automatic", "payment_method": "pm_1Sa7LEPBUlX7cw67McLmGqdC", "transfer_group": null, "amount_received": 4900, "payment_details": {"order_reference": "cs_test_a1Pr9VLelz8BoQ1O7", "customer_reference": null}, "amount_capturable": 0, "last_payment_error": null, "setup_future_usage": "off_session", "cancellation_reason": null, "confirmation_method": "automatic", "payment_method_types": ["card"], "statement_descriptor": null, "application_fee_amount": null, "payment_method_options": {"card": {"network": null, "installments": null, "mandate_options": null, "setup_future_usage": "off_session", "request_three_d_secure": "automatic"}}, "automatic_payment_methods": null, "statement_descriptor_suffix": null, "excluded_payment_method_types": null, "payment_method_configuration_details": null}	acct_1SZwOrPBUlX7cw67
\.


--
-- Data for Name: payment_methods; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe.payment_methods (_last_synced_at, _raw_data, _account_id) FROM stdin;
2025-12-03 04:57:48.979+00	{"id": "pm_1Sa7LEPBUlX7cw67McLmGqdC", "card": {"brand": "visa", "last4": "1879", "checks": {"cvc_check": null, "address_line1_check": "unchecked", "address_postal_code_check": "unchecked"}, "wallet": {"type": "apple_pay", "apple_pay": {"type": "apple_pay"}, "dynamic_last4": "8550"}, "country": "US", "funding": "debit", "exp_year": 2031, "networks": {"available": ["visa"], "preferred": null}, "exp_month": 12, "fingerprint": "OoQF6SHru2gKsSjT", "display_brand": "visa", "generated_from": null, "regulated_status": "regulated", "three_d_secure_usage": {"supported": true}}, "type": "card", "object": "payment_method", "created": 1764734820, "customer": "cus_TXBhlIW5vEDNvP", "livemode": false, "metadata": {}, "allow_redisplay": "limited", "billing_details": {"name": "Veronica Merrick", "email": "vee@vee.com", "phone": null, "tax_id": null, "address": {"city": "Los Angeles", "line1": "5461 Yarmouth Ave", "line2": "35", "state": "CA", "country": "US", "postal_code": "91316"}}}	acct_1SZwOrPBUlX7cw67
\.


--
-- Data for Name: payouts; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe.payouts (_updated_at, _last_synced_at, _raw_data) FROM stdin;
\.


--
-- Data for Name: plans; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe.plans (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
2025-12-03 04:57:44.148537+00	2025-12-03 04:57:44.139+00	{"id": "price_1Sa7CIPBUlX7cw67f5eJMTf6", "meter": null, "active": true, "amount": 4900, "object": "plan", "created": 1764734266, "product": "prod_TXBZEQFMYZLmTq", "currency": "usd", "interval": "month", "livemode": false, "metadata": {}, "nickname": null, "tiers_mode": null, "usage_type": "licensed", "amount_decimal": "4900", "billing_scheme": "per_unit", "interval_count": 1, "transform_usage": null, "trial_period_days": null}	acct_1SZwOrPBUlX7cw67
\.


--
-- Data for Name: prices; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe.prices (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
2025-12-03 04:57:43.580127+00	2025-12-03 04:57:43.57+00	{"id": "price_1Sa7CIPBUlX7cw67f5eJMTf6", "type": "recurring", "active": true, "object": "price", "created": 1764734266, "product": "prod_TXBZEQFMYZLmTq", "currency": "usd", "livemode": false, "metadata": {}, "nickname": null, "recurring": {"meter": null, "interval": "month", "usage_type": "licensed", "interval_count": 1, "trial_period_days": null}, "lookup_key": null, "tiers_mode": null, "unit_amount": 4900, "tax_behavior": "unspecified", "billing_scheme": "per_unit", "custom_unit_amount": null, "transform_quantity": null, "unit_amount_decimal": "4900"}	acct_1SZwOrPBUlX7cw67
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe.products (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
2025-12-03 04:57:43.134184+00	2025-12-03 04:57:43.102+00	{"id": "prod_TXBZEQFMYZLmTq", "url": null, "name": "Provider Monthly Subscription", "type": "service", "active": true, "images": [], "object": "product", "created": 1764734266, "updated": 1764734266, "livemode": false, "metadata": {"type": "provider_subscription"}, "tax_code": null, "shippable": null, "attributes": [], "unit_label": null, "description": "Monthly subscription for housing providers to list properties on Sober Stay", "default_price": null, "marketing_features": [], "package_dimensions": null, "statement_descriptor": null}	acct_1SZwOrPBUlX7cw67
\.


--
-- Data for Name: refunds; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe.refunds (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe.reviews (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: setup_intents; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe.setup_intents (_last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: subscription_items; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe.subscription_items (_last_synced_at, _raw_data, _account_id) FROM stdin;
2025-12-03 04:57:45.83+00	{"id": "si_TXBicJZ8HKc99S", "plan": {"id": "price_1Sa7CIPBUlX7cw67f5eJMTf6", "meter": null, "active": true, "amount": 4900, "object": "plan", "created": 1764734266, "product": "prod_TXBZEQFMYZLmTq", "currency": "usd", "interval": "month", "livemode": false, "metadata": {}, "nickname": null, "tiers_mode": null, "usage_type": "licensed", "amount_decimal": "4900", "billing_scheme": "per_unit", "interval_count": 1, "transform_usage": null, "trial_period_days": null}, "price": "price_1Sa7CIPBUlX7cw67f5eJMTf6", "object": "subscription_item", "created": 1764734821, "deleted": false, "metadata": {}, "quantity": 1, "discounts": [], "tax_rates": [], "subscription": "sub_1Sa7LIPBUlX7cw67li4ldB3N", "billing_thresholds": null, "current_period_end": 1767413221, "current_period_start": 1764734821}	acct_1SZwOrPBUlX7cw67
\.


--
-- Data for Name: subscription_schedules; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe.subscription_schedules (_last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe.subscriptions (_updated_at, _last_synced_at, _raw_data, _account_id) FROM stdin;
2025-12-03 04:57:45.590929+00	2025-12-03 04:57:45.581+00	{"id": "sub_1Sa7LIPBUlX7cw67li4ldB3N", "plan": {"id": "price_1Sa7CIPBUlX7cw67f5eJMTf6", "meter": null, "active": true, "amount": 4900, "object": "plan", "created": 1764734266, "product": "prod_TXBZEQFMYZLmTq", "currency": "usd", "interval": "month", "livemode": false, "metadata": {}, "nickname": null, "tiers_mode": null, "usage_type": "licensed", "amount_decimal": "4900", "billing_scheme": "per_unit", "interval_count": 1, "transform_usage": null, "trial_period_days": null}, "items": {"url": "/v1/subscription_items?subscription=sub_1Sa7LIPBUlX7cw67li4ldB3N", "data": [{"id": "si_TXBicJZ8HKc99S", "plan": {"id": "price_1Sa7CIPBUlX7cw67f5eJMTf6", "meter": null, "active": true, "amount": 4900, "object": "plan", "created": 1764734266, "product": "prod_TXBZEQFMYZLmTq", "currency": "usd", "interval": "month", "livemode": false, "metadata": {}, "nickname": null, "tiers_mode": null, "usage_type": "licensed", "amount_decimal": "4900", "billing_scheme": "per_unit", "interval_count": 1, "transform_usage": null, "trial_period_days": null}, "price": {"id": "price_1Sa7CIPBUlX7cw67f5eJMTf6", "type": "recurring", "active": true, "object": "price", "created": 1764734266, "product": "prod_TXBZEQFMYZLmTq", "currency": "usd", "livemode": false, "metadata": {}, "nickname": null, "recurring": {"meter": null, "interval": "month", "usage_type": "licensed", "interval_count": 1, "trial_period_days": null}, "lookup_key": null, "tiers_mode": null, "unit_amount": 4900, "tax_behavior": "unspecified", "billing_scheme": "per_unit", "custom_unit_amount": null, "transform_quantity": null, "unit_amount_decimal": "4900"}, "object": "subscription_item", "created": 1764734821, "metadata": {}, "quantity": 1, "discounts": [], "tax_rates": [], "subscription": "sub_1Sa7LIPBUlX7cw67li4ldB3N", "billing_thresholds": null, "current_period_end": 1767413221, "current_period_start": 1764734821}], "object": "list", "has_more": false, "total_count": 1}, "object": "subscription", "status": "active", "created": 1764734821, "currency": "usd", "customer": "cus_TXBhlIW5vEDNvP", "ended_at": null, "livemode": false, "metadata": {}, "quantity": 1, "schedule": null, "cancel_at": null, "discounts": [], "trial_end": null, "start_date": 1764734821, "test_clock": null, "application": null, "canceled_at": null, "description": null, "trial_start": null, "billing_mode": {"type": "classic", "flexible": null}, "on_behalf_of": null, "automatic_tax": {"enabled": false, "liability": null, "disabled_reason": null}, "transfer_data": null, "days_until_due": null, "default_source": null, "latest_invoice": "in_1Sa7LFPBUlX7cw67yoVishQP", "pending_update": null, "trial_settings": {"end_behavior": {"missing_payment_method": "create_invoice"}}, "invoice_settings": {"issuer": {"type": "self"}, "account_tax_ids": null}, "pause_collection": null, "payment_settings": {"payment_method_types": ["card"], "payment_method_options": {"card": {"network": null, "request_three_d_secure": "automatic"}, "konbini": null, "acss_debit": null, "bancontact": null, "sepa_debit": null, "us_bank_account": null, "customer_balance": null}, "save_default_payment_method": "off"}, "collection_method": "charge_automatically", "default_tax_rates": [], "billing_thresholds": null, "billing_cycle_anchor": 1764734821, "cancel_at_period_end": false, "cancellation_details": {"reason": null, "comment": null, "feedback": null}, "pending_setup_intent": null, "default_payment_method": "pm_1Sa7LEPBUlX7cw67McLmGqdC", "application_fee_percent": null, "billing_cycle_anchor_config": null, "pending_invoice_item_interval": null, "next_pending_invoice_item_invoice": null}	acct_1SZwOrPBUlX7cw67
\.


--
-- Data for Name: tax_ids; Type: TABLE DATA; Schema: stripe; Owner: neondb_owner
--

COPY stripe.tax_ids (_last_synced_at, _raw_data, _account_id) FROM stdin;
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: neondb_owner
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 1, false);


--
-- Name: applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.applications_id_seq', 1, false);


--
-- Name: listings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.listings_id_seq', 4, true);


--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.password_reset_tokens_id_seq', 1, true);


--
-- Name: subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.subscriptions_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 16, true);


--
-- Name: _sync_status_id_seq; Type: SEQUENCE SET; Schema: stripe; Owner: neondb_owner
--

SELECT pg_catalog.setval('stripe._sync_status_id_seq', 255, true);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: neondb_owner
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- Name: listings listings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_google_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_google_id_key UNIQUE (google_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: _migrations _migrations_name_key; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe._migrations
    ADD CONSTRAINT _migrations_name_key UNIQUE (name);


--
-- Name: _migrations _migrations_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe._migrations
    ADD CONSTRAINT _migrations_pkey PRIMARY KEY (id);


--
-- Name: _sync_status _sync_status_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe._sync_status
    ADD CONSTRAINT _sync_status_pkey PRIMARY KEY (id);


--
-- Name: _sync_status _sync_status_resource_account_key; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe._sync_status
    ADD CONSTRAINT _sync_status_resource_account_key UNIQUE (resource, account_id);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: active_entitlements active_entitlements_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.active_entitlements
    ADD CONSTRAINT active_entitlements_pkey PRIMARY KEY (id);


--
-- Name: charges charges_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.charges
    ADD CONSTRAINT charges_pkey PRIMARY KEY (id);


--
-- Name: checkout_session_line_items checkout_session_line_items_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.checkout_session_line_items
    ADD CONSTRAINT checkout_session_line_items_pkey PRIMARY KEY (id);


--
-- Name: checkout_sessions checkout_sessions_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.checkout_sessions
    ADD CONSTRAINT checkout_sessions_pkey PRIMARY KEY (id);


--
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);


--
-- Name: credit_notes credit_notes_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.credit_notes
    ADD CONSTRAINT credit_notes_pkey PRIMARY KEY (id);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: disputes disputes_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.disputes
    ADD CONSTRAINT disputes_pkey PRIMARY KEY (id);


--
-- Name: early_fraud_warnings early_fraud_warnings_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.early_fraud_warnings
    ADD CONSTRAINT early_fraud_warnings_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: features features_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.features
    ADD CONSTRAINT features_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: _managed_webhooks managed_webhooks_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe._managed_webhooks
    ADD CONSTRAINT managed_webhooks_pkey PRIMARY KEY (id);


--
-- Name: _managed_webhooks managed_webhooks_uuid_key; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe._managed_webhooks
    ADD CONSTRAINT managed_webhooks_uuid_key UNIQUE (uuid);


--
-- Name: payment_intents payment_intents_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.payment_intents
    ADD CONSTRAINT payment_intents_pkey PRIMARY KEY (id);


--
-- Name: payment_methods payment_methods_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.payment_methods
    ADD CONSTRAINT payment_methods_pkey PRIMARY KEY (id);


--
-- Name: payouts payouts_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.payouts
    ADD CONSTRAINT payouts_pkey PRIMARY KEY (id);


--
-- Name: plans plans_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.plans
    ADD CONSTRAINT plans_pkey PRIMARY KEY (id);


--
-- Name: prices prices_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.prices
    ADD CONSTRAINT prices_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: refunds refunds_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.refunds
    ADD CONSTRAINT refunds_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: setup_intents setup_intents_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.setup_intents
    ADD CONSTRAINT setup_intents_pkey PRIMARY KEY (id);


--
-- Name: subscription_items subscription_items_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.subscription_items
    ADD CONSTRAINT subscription_items_pkey PRIMARY KEY (id);


--
-- Name: subscription_schedules subscription_schedules_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.subscription_schedules
    ADD CONSTRAINT subscription_schedules_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: tax_ids tax_ids_pkey; Type: CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.tax_ids
    ADD CONSTRAINT tax_ids_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: active_entitlements_lookup_key_key; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE UNIQUE INDEX active_entitlements_lookup_key_key ON stripe.active_entitlements USING btree (lookup_key) WHERE (lookup_key IS NOT NULL);


--
-- Name: features_lookup_key_key; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE UNIQUE INDEX features_lookup_key_key ON stripe.features USING btree (lookup_key) WHERE (lookup_key IS NOT NULL);


--
-- Name: idx_accounts_api_key_hashes; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX idx_accounts_api_key_hashes ON stripe.accounts USING gin (api_key_hashes);


--
-- Name: idx_accounts_business_name; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX idx_accounts_business_name ON stripe.accounts USING btree (business_name);


--
-- Name: idx_sync_status_resource_account; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX idx_sync_status_resource_account ON stripe._sync_status USING btree (resource, account_id);


--
-- Name: stripe_active_entitlements_customer_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_active_entitlements_customer_idx ON stripe.active_entitlements USING btree (customer);


--
-- Name: stripe_active_entitlements_feature_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_active_entitlements_feature_idx ON stripe.active_entitlements USING btree (feature);


--
-- Name: stripe_checkout_session_line_items_price_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_checkout_session_line_items_price_idx ON stripe.checkout_session_line_items USING btree (price);


--
-- Name: stripe_checkout_session_line_items_session_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_checkout_session_line_items_session_idx ON stripe.checkout_session_line_items USING btree (checkout_session);


--
-- Name: stripe_checkout_sessions_customer_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_checkout_sessions_customer_idx ON stripe.checkout_sessions USING btree (customer);


--
-- Name: stripe_checkout_sessions_invoice_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_checkout_sessions_invoice_idx ON stripe.checkout_sessions USING btree (invoice);


--
-- Name: stripe_checkout_sessions_payment_intent_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_checkout_sessions_payment_intent_idx ON stripe.checkout_sessions USING btree (payment_intent);


--
-- Name: stripe_checkout_sessions_subscription_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_checkout_sessions_subscription_idx ON stripe.checkout_sessions USING btree (subscription);


--
-- Name: stripe_credit_notes_customer_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_credit_notes_customer_idx ON stripe.credit_notes USING btree (customer);


--
-- Name: stripe_credit_notes_invoice_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_credit_notes_invoice_idx ON stripe.credit_notes USING btree (invoice);


--
-- Name: stripe_dispute_created_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_dispute_created_idx ON stripe.disputes USING btree (created);


--
-- Name: stripe_early_fraud_warnings_charge_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_early_fraud_warnings_charge_idx ON stripe.early_fraud_warnings USING btree (charge);


--
-- Name: stripe_early_fraud_warnings_payment_intent_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_early_fraud_warnings_payment_intent_idx ON stripe.early_fraud_warnings USING btree (payment_intent);


--
-- Name: stripe_invoices_customer_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_invoices_customer_idx ON stripe.invoices USING btree (customer);


--
-- Name: stripe_invoices_subscription_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_invoices_subscription_idx ON stripe.invoices USING btree (subscription);


--
-- Name: stripe_managed_webhooks_enabled_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_managed_webhooks_enabled_idx ON stripe._managed_webhooks USING btree (enabled);


--
-- Name: stripe_managed_webhooks_status_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_managed_webhooks_status_idx ON stripe._managed_webhooks USING btree (status);


--
-- Name: stripe_managed_webhooks_uuid_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_managed_webhooks_uuid_idx ON stripe._managed_webhooks USING btree (uuid);


--
-- Name: stripe_payment_intents_customer_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_payment_intents_customer_idx ON stripe.payment_intents USING btree (customer);


--
-- Name: stripe_payment_intents_invoice_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_payment_intents_invoice_idx ON stripe.payment_intents USING btree (invoice);


--
-- Name: stripe_payment_methods_customer_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_payment_methods_customer_idx ON stripe.payment_methods USING btree (customer);


--
-- Name: stripe_refunds_charge_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_refunds_charge_idx ON stripe.refunds USING btree (charge);


--
-- Name: stripe_refunds_payment_intent_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_refunds_payment_intent_idx ON stripe.refunds USING btree (payment_intent);


--
-- Name: stripe_reviews_charge_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_reviews_charge_idx ON stripe.reviews USING btree (charge);


--
-- Name: stripe_reviews_payment_intent_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_reviews_payment_intent_idx ON stripe.reviews USING btree (payment_intent);


--
-- Name: stripe_setup_intents_customer_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_setup_intents_customer_idx ON stripe.setup_intents USING btree (customer);


--
-- Name: stripe_tax_ids_customer_idx; Type: INDEX; Schema: stripe; Owner: neondb_owner
--

CREATE INDEX stripe_tax_ids_customer_idx ON stripe.tax_ids USING btree (customer);


--
-- Name: _managed_webhooks handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: neondb_owner
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe._managed_webhooks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_metadata();


--
-- Name: _sync_status handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: neondb_owner
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe._sync_status FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_metadata();


--
-- Name: accounts handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: neondb_owner
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.accounts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: active_entitlements handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: neondb_owner
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.active_entitlements FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: charges handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: neondb_owner
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.charges FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: checkout_session_line_items handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: neondb_owner
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.checkout_session_line_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: checkout_sessions handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: neondb_owner
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.checkout_sessions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: coupons handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: neondb_owner
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.coupons FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: customers handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: neondb_owner
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.customers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: disputes handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: neondb_owner
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.disputes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: early_fraud_warnings handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: neondb_owner
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.early_fraud_warnings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: events handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: neondb_owner
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: features handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: neondb_owner
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.features FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: invoices handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: neondb_owner
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.invoices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: payouts handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: neondb_owner
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.payouts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: plans handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: neondb_owner
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.plans FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: prices handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: neondb_owner
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.prices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: products handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: neondb_owner
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: refunds handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: neondb_owner
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.refunds FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: reviews handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: neondb_owner
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.reviews FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: subscriptions handle_updated_at; Type: TRIGGER; Schema: stripe; Owner: neondb_owner
--

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON stripe.subscriptions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: applications applications_listing_id_listings_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_listing_id_listings_id_fk FOREIGN KEY (listing_id) REFERENCES public.listings(id);


--
-- Name: applications applications_tenant_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_tenant_id_users_id_fk FOREIGN KEY (tenant_id) REFERENCES public.users(id);


--
-- Name: listings listings_provider_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_provider_id_users_id_fk FOREIGN KEY (provider_id) REFERENCES public.users(id);


--
-- Name: password_reset_tokens password_reset_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: subscriptions subscriptions_provider_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_provider_id_users_id_fk FOREIGN KEY (provider_id) REFERENCES public.users(id);


--
-- Name: active_entitlements fk_active_entitlements_account; Type: FK CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.active_entitlements
    ADD CONSTRAINT fk_active_entitlements_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: charges fk_charges_account; Type: FK CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.charges
    ADD CONSTRAINT fk_charges_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: checkout_session_line_items fk_checkout_session_line_items_account; Type: FK CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.checkout_session_line_items
    ADD CONSTRAINT fk_checkout_session_line_items_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: checkout_sessions fk_checkout_sessions_account; Type: FK CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.checkout_sessions
    ADD CONSTRAINT fk_checkout_sessions_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: credit_notes fk_credit_notes_account; Type: FK CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.credit_notes
    ADD CONSTRAINT fk_credit_notes_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: customers fk_customers_account; Type: FK CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.customers
    ADD CONSTRAINT fk_customers_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: disputes fk_disputes_account; Type: FK CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.disputes
    ADD CONSTRAINT fk_disputes_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: early_fraud_warnings fk_early_fraud_warnings_account; Type: FK CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.early_fraud_warnings
    ADD CONSTRAINT fk_early_fraud_warnings_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: features fk_features_account; Type: FK CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.features
    ADD CONSTRAINT fk_features_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: invoices fk_invoices_account; Type: FK CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.invoices
    ADD CONSTRAINT fk_invoices_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: _managed_webhooks fk_managed_webhooks_account; Type: FK CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe._managed_webhooks
    ADD CONSTRAINT fk_managed_webhooks_account FOREIGN KEY (account_id) REFERENCES stripe.accounts(id);


--
-- Name: payment_intents fk_payment_intents_account; Type: FK CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.payment_intents
    ADD CONSTRAINT fk_payment_intents_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: payment_methods fk_payment_methods_account; Type: FK CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.payment_methods
    ADD CONSTRAINT fk_payment_methods_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: plans fk_plans_account; Type: FK CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.plans
    ADD CONSTRAINT fk_plans_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: prices fk_prices_account; Type: FK CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.prices
    ADD CONSTRAINT fk_prices_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: products fk_products_account; Type: FK CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.products
    ADD CONSTRAINT fk_products_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: refunds fk_refunds_account; Type: FK CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.refunds
    ADD CONSTRAINT fk_refunds_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: reviews fk_reviews_account; Type: FK CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.reviews
    ADD CONSTRAINT fk_reviews_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: setup_intents fk_setup_intents_account; Type: FK CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.setup_intents
    ADD CONSTRAINT fk_setup_intents_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: subscription_items fk_subscription_items_account; Type: FK CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.subscription_items
    ADD CONSTRAINT fk_subscription_items_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: subscription_schedules fk_subscription_schedules_account; Type: FK CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.subscription_schedules
    ADD CONSTRAINT fk_subscription_schedules_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: subscriptions fk_subscriptions_account; Type: FK CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.subscriptions
    ADD CONSTRAINT fk_subscriptions_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: _sync_status fk_sync_status_account; Type: FK CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe._sync_status
    ADD CONSTRAINT fk_sync_status_account FOREIGN KEY (account_id) REFERENCES stripe.accounts(id);


--
-- Name: tax_ids fk_tax_ids_account; Type: FK CONSTRAINT; Schema: stripe; Owner: neondb_owner
--

ALTER TABLE ONLY stripe.tax_ids
    ADD CONSTRAINT fk_tax_ids_account FOREIGN KEY (_account_id) REFERENCES stripe.accounts(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict ioH1CJQbJJaRjwC02Cskx42cvaaI4SNsFG0LNmuiqGk9AgeAZ03De3twpJ3YYbO

